import { io } from "../../app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Send notification to plumber assigned to a channel (manual trigger)
const sendNotification = async (req, res) => {
    try {
        const { channelId, message } = req.body;

        // Validate input
        if (!channelId || !message) {
            return res.status(400).json({ message: "Channel ID and message are required" });
        }

        // Find channel by its unique channelId
        const channel = await prisma.channel.findUnique({
            where: { channelId: channelId },
            include: { 
                plumber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        if (!channel.plumber) {
            return res.status(404).json({ message: "No plumber assigned to this channel" });
        }

        // Create notification in database
        const notification = await prisma.notification.create({
            data: {
                message,
                channelId: channel.id, // Internal database ID
                plumberId: channel.plumber.id,
            },
        });

        // Prepare notification data for real-time emit
        const notificationData = {
            id: notification.id,
            message,
            channel: {
                channelId: channel.channelId,
                name: channel.name,
                location: channel.location,
                status: channel.status
            },
            timestamp: notification.createdAt
        };

        // Emit notification to plumber's socket room
        io.to(channel.plumber.id).emit("notification", notificationData);

        res.status(200).json({ 
            message: "Notification sent to plumber", 
            plumber: {
                id: channel.plumber.id,
                name: channel.plumber.name
            },
            channel: channel.name,
            notificationId: notification.id
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error sending notification", 
            error: error.message 
        });
    }
};

// Get all notifications for a plumber
const getPlumberNotifications = async (req, res) => {
    try {
        const { plumberId } = req.params;

        const plumber = await prisma.plumber.findUnique({
            where: { id: plumberId },
            include: {
                assignedChannels: true,
                Notification: true // Include notifications relation
            }
        });

        if (!plumber) {
            return res.status(404).json({ message: "Plumber not found" });
        }

        const notifications = await prisma.notification.findMany({
            where: { plumberId },
            orderBy: { createdAt: "desc" },
            include: {
                channel: {
                    select: {
                        channelId: true,
                        name: true,
                        location: true,
                        status: true,
                        waterLost: true,
                        solveTime: true
                    }
                }
            }
        });

        res.status(200).json({
            plumberId,
            notifications
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching notifications", 
            error: error.message 
        });
    }
};

// Function to notify plumber when channel status changes (to be called when channel is updated)
const notifyOnChannelProblem = async (channelId) => {
    try {
        const channel = await prisma.channel.findUnique({
            where: { channelId },
            include: { plumber: true }
        });

        if (!channel || !channel.plumber) return; // No action if no channel or plumber

        // Check if there's a problem (e.g., status changed from "unsolved" or metrics indicate an issue)
        if (channel.status !== "solved" && (channel.waterLost > 0 || channel.solveTime === null)) {
            const message = `Problem detected at channel ${channel.name}: Status - ${channel.status}, Water Lost - ${channel.waterLost || 'unknown'}`;

            const notification = await prisma.notification.create({
                data: {
                    message,
                    channelId: channel.id,
                    plumberId: channel.plumber.id,
                },
            });

            const notificationData = {
                id: notification.id,
                message,
                channel: {
                    channelId: channel.channelId,
                    name: channel.name,
                    location: channel.location,
                    status: channel.status,
                    waterLost: channel.waterLost
                },
                timestamp: notification.createdAt
            };

            io.to(channel.plumber.id).emit("notification", notificationData);
            console.log(`Notification sent to plumber ${channel.plumber.id} for channel ${channelId}`);
        }
    } catch (error) {
        console.error("Error in notifyOnChannelProblem:", error.message);
    }
};

// Example integration with channel update (you'd call this in your channel controller)
const updateChannelWithNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { channelId, status, waterLost, solveTime } = req.body;

        const updatedChannel = await prisma.channel.update({
            where: { id },
            data: { channelId, status, waterLost, solveTime },
        });

        // Trigger notification if there's a problem
        await notifyOnChannelProblem(updatedChannel.channelId);

        res.json(updatedChannel);
    } catch (error) {
        res.status(500).json({ message: "Error updating channel", error: error.message });
    }
};

export { sendNotification, getPlumberNotifications, notifyOnChannelProblem, updateChannelWithNotification };