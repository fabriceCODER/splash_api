import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createChannel = async (req, res) => {
    try {
        const { channelId, name, location, stationCount, managerId, plumberId, status, waterLost, solveTime, initialFlowRate, statusPerStation } = req.body;

        // Validate required fields
        if (!channelId || !name || !location || !stationCount || !managerId) {
            return res.status(400).json({ message: "Missing required fields: channelId, name, location, stationCount, managerId" });
        }

        // Check if channelId is unique
        const existingChannel = await prisma.channel.findUnique({ where: { channelId } });
        if (existingChannel) {
            return res.status(400).json({ message: "Channel ID already exists" });
        }

        const channel = await prisma.channel.create({
            data: {
                channelId,
                name,
                location,
                stationCount,
                managerId,
                plumberId: plumberId || null, // Optional relation
                status: status || "unsolved",
                waterLost: waterLost || null,
                solveTime: solveTime || null,
                initialFlowRate: initialFlowRate || null,
                statusPerStation: statusPerStation || null,
            },
        });

        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: "Error creating channel", error: error.message });
    }
};

export const getChannel = async (req, res) => {
    try {
        const { id } = req.params;

        const channel = await prisma.channel.findUnique({
            where: { id },
            include: {
                manager: true,
                plumber: true,
            },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching channel", error: error.message });
    }
};

export const getAllChannels = async (req, res) => {
    try {
        const channels = await prisma.channel.findMany({
            include: {
                manager: true,
                plumber: true,
            },
        });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching channels", error: error.message });
    }
};

export const updateChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const { channelId, name, location, stationCount, managerId, plumberId, status, waterLost, solveTime, initialFlowRate, statusPerStation } = req.body;

        const channel = await prisma.channel.findUnique({ where: { id } });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const updatedChannel = await prisma.channel.update({
            where: { id },
            data: {
                channelId: channelId || channel.channelId,
                name: name || channel.name,
                location: location || channel.location,
                stationCount: stationCount !== undefined ? stationCount : channel.stationCount,
                managerId: managerId || channel.managerId,
                plumberId: plumberId !== undefined ? plumberId : channel.plumberId,
                status: status || channel.status,
                waterLost: waterLost !== undefined ? waterLost : channel.waterLost,
                solveTime: solveTime !== undefined ? solveTime : channel.solveTime,
                initialFlowRate: initialFlowRate !== undefined ? initialFlowRate : channel.initialFlowRate,
                statusPerStation: statusPerStation !== undefined ? statusPerStation : channel.statusPerStation,
            },
        });

        // Trigger notification check
        await notifyOnChannelProblem(updatedChannel.channelId);

        res.json(updatedChannel);
    } catch (error) {
        res.status(500).json({ message: "Error updating channel", error: error.message });
    }
};

export const deleteChannel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if channel exists
        const channel = await prisma.channel.findUnique({ where: { id } });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        await prisma.channel.delete({ where: { id } });
        res.json({ message: "Channel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting channel", error: error.message });
    }
};