import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getAnalytics = async (req, res) => {
    try {
        const adminId = req.user.id; // Ensure authentication middleware sets req.user

        // Fetch all channels under the admin
        const channels = await prisma.channel.findMany({
            where: { adminId },
            include: { issues: true },
        });

        let totalWaterLost = 0;
        let totalIssues = 0;
        let solvedIssues = 0;
        let unsolvedIssues = 0;
        let totalSolveTime = 0;
        let resolvedCount = 0;

        const channelData = channels.map((channel) => {
            let channelSolved = 0;
            let channelUnsolved = 0;
            let channelWaterLost = 0;
            let channelSolveTime = 0;
            let channelResolvedCount = 0;

            channel.issues.forEach((issue) => {
                totalIssues++;

                if (issue.status === "solved") {
                    solvedIssues++;
                    channelSolved++;
                    const timeTaken = (new Date(issue.solvedAt) - new Date(issue.createdAt)) / (1000 * 60 * 60); // Convert to hours
                    totalSolveTime += timeTaken;
                    channelSolveTime += timeTaken;
                    resolvedCount++;
                    channelResolvedCount++;
                } else {
                    unsolvedIssues++;
                    channelUnsolved++;
                }

                totalWaterLost += issue.waterLost;
                channelWaterLost += issue.waterLost;
            });

            return {
                channelName: channel.name,
                solved: channelSolved,
                unsolved: channelUnsolved,
                waterLost: channelWaterLost,
                avgSolveTime: channelResolvedCount > 0 ? channelSolveTime / channelResolvedCount : 0,
            };
        });

        const avgSolveTime = resolvedCount > 0 ? totalSolveTime / resolvedCount : 0;

        res.status(200).json({
            totalIssues,
            solvedIssues,
            unsolvedIssues,
            totalWaterLost,
            avgSolveTime,
            channelData,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Failed to fetch analytics", error });
    }
};
