import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route GET /api/manager/analytics
 * @desc Get analytics for channels managed by the authenticated Manager
 * @access Private (Manager only)
 */
export const getAnalytics = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { page = 1, limit = 10 } = req.query; // Add pagination params

        // Fetch channels with pagination
        const channels = await prisma.channel.findMany({
            where: { managerId },
            include: {
                plumber: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            skip: (page - 1) * limit,
            take: parseInt(limit),
        });

        const totalChannels = await prisma.channel.count({ where: { managerId } });

        // Initialize aggregate metrics
        let totalWaterLost = 0;
        let solvedChannels = 0;
        let unsolvedChannels = 0;
        let totalSolveTime = 0;
        let resolvedCount = 0;

        // Process each channel for detailed analytics
        const channelData = channels.map((channel) => {
            const isSolved = channel.status === "solved";
            const waterLost = channel.waterLost || 0;
            const solveTime = channel.solveTime || 0;

            if (isSolved) {
                solvedChannels++;
                totalSolveTime += solveTime;
                resolvedCount++;
            } else {
                unsolvedChannels++;
            }

            totalWaterLost += waterLost;

            return {
                channelId: channel.channelId,
                channelName: channel.name,
                location: channel.location,
                status: channel.status,
                waterLost,
                solveTime,
                stationCount: channel.stationCount,
                plumber: channel.plumber ? { id: channel.plumber.id, name: channel.plumber.name } : null,
            };
        });

        const avgSolveTime = resolvedCount > 0 ? totalSolveTime / resolvedCount : 0;

        res.status(200).json({
            totalChannels,
            solvedChannels,
            unsolvedChannels,
            totalWaterLost,
            avgSolveTime,
            channelData,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalChannels / limit),
                totalItems: totalChannels,
            },
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
    }
};

/**
 * @route GET /api/manager/plumbers
 * @desc Get all plumbers managed by the authenticated Manager
 * @access Private (Manager only)
 */
export const getPlumbers = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { page = 1, limit = 10 } = req.query; // Add pagination params

        const plumbers = await prisma.plumber.findMany({
            where: { managerId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                assignedChannels: {
                    select: {
                        channelId: true,
                        name: true,
                        status: true,
                    },
                },
            },
            skip: (page - 1) * limit,
            take: parseInt(limit),
        });

        const totalPlumbers = await prisma.plumber.count({ where: { managerId } });

        res.status(200).json({
            plumbers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalPlumbers / limit),
                totalItems: totalPlumbers,
            },
        });
    } catch (error) {
        console.error("Error fetching plumbers:", error);
        res.status(500).json({ message: "Failed to fetch plumbers", error: error.message });
    }
};

/**
 * @route GET /api/manager/channels
 * @desc Get all channels managed by the authenticated Manager
 * @access Private (Manager only)
 */
export const getChannels = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { page = 1, limit = 10 } = req.query; // Add pagination params

        const channels = await prisma.channel.findMany({
            where: { managerId },
            include: {
                plumber: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
destChannel: {
                channelId: channelId,
                name: destChannel.name,
                location: destChannel.location,
                status: destChannel.status,
            },
            plumber: {
                id: plumber.id,
                name: plumber.name,
                email: plumber.email,
            },
        });
    } catch (error) {
        console.error("Error assigning plumber:", error);
        res.status(500).json({ message: "Failed to assign plumber", error: error.message });
    }
};