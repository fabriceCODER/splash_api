import { io } from "../../app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Send notification to plumber assigned to a channel
const sendNotification = async (req, res) => {
    try {
        const { channelId, message } = req.body;

        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: { plumber: true },
        });
        channel.name = undefined;

        if (!channel || !channel.plumber) {
            return res.status(404).json({ message: "Channel or assigned plumber not found" });
        }

        io.to(channelId).emit("notification", { message, channel: channel.name });

        res.status(200).json({ message: "Notification sent to plumber", channel: channel.name });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error });
    }
};

export { sendNotification };
