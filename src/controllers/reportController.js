import { PrismaClient } from "@prisma/client";
import cron from "node-cron"; 

const prisma = new PrismaClient();

// Generate a Daily Report for a Manager (manual trigger)
export const generateDailyReport = async (req, res) => {
    try {
        const managerId = req.user.id; // Assuming req.user.id is the manager's ID

        // Fetch channels managed by this manager
        const channels = await prisma.channel.findMany({
            where: { managerId },
        });

        // Calculate report metrics
        const solvedIssues = channels.filter(channel => channel.status === "solved");
        const unsolvedIssues = channels.filter(channel => channel.status === "unsolved");

        const totalWaterLost = solvedIssues.reduce((sum, channel) => sum + (channel.waterLost || 0), 0);
        const avgSolveTime = solvedIssues.length > 0
            ? solvedIssues.reduce((sum, channel) => sum + (channel.solveTime || 0), 0) / solvedIssues.length
            : 0;

        const initialFlowRate = channels.length > 0
            ? channels.reduce((sum, channel) => sum + (channel.initialFlowRate || 0), 0) / channels.length
            : null;

        // Aggregate station status (example: count unsolved stations)
        const stationStatus = channels.reduce((acc, channel) => {
            if (channel.statusPerStation) {
                const unsolvedStations = Object.values(channel.statusPerStation).filter(status => status !== "solved").length;
                acc.unsolvedStations = (acc.unsolvedStations || 0) + unsolvedStations;
                acc.totalStations = (acc.totalStations || 0) + channel.stationCount;
            }
            return acc;
        }, { unsolvedStations: 0, totalStations: 0 });

        // Create the daily report
        const report = await prisma.dailyReport.create({
            data: {
                managerId,
                solved: solvedIssues.length,
                unsolved: unsolvedIssues.length,
                waterLost: totalWaterLost,
                avgSolveTime,
                initialFlowRate,
                stationStatus: stationStatus.totalStations > 0 ? stationStatus : null,
            },
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating daily report", error: error.message });
    }
};

// Get Daily Reports for a Manager
export const getDailyReports = async (req, res) => {
    try {
        const managerId = req.user.id;

        const reports = await prisma.dailyReport.findMany({
            where: { managerId },
            orderBy: { createdAt: "desc" },
            take: 7, // Last 7 days of reports
        });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
};

// Automated daily report generation for all managers
const generateDailyReportsForAllManagers = async () => {
    try {
        const managers = await prisma.manager.findMany();

        for (const manager of managers) {
            const channels = await prisma.channel.findMany({
                where: { managerId: manager.id },
            });

            const solvedIssues = channels.filter(channel => channel.status === "solved");
            const unsolvedIssues = channels.filter(channel => channel.status === "unsolved");

            const totalWaterLost = solvedIssues.reduce((sum, channel) => sum + (channel.waterLost || 0), 0);
            const avgSolveTime = solvedIssues.length > 0
                ? solvedIssues.reduce((sum, channel) => sum + (channel.solveTime || 0), 0) / solvedIssues.length
                : 0;

            const initialFlowRate = channels.length > 0
                ? channels.reduce((sum, channel) => sum + (channel.initialFlowRate || 0), 0) / channels.length
                : null;

            const stationStatus = channels.reduce((acc, channel) => {
                if (channel.statusPerStation) {
                    const unsolvedStations = Object.values(channel.statusPerStation).filter(status => status !== "solved").length;
                    acc.unsolvedStations = (acc.unsolvedStations || 0) + unsolvedStations;
                    acc.totalStations = (acc.totalStations || 0) + channel.stationCount;
                }
                return acc;
            }, { unsolvedStations: 0, totalStations: 0 });

            await prisma.dailyReport.create({
                data: {
                    managerId: manager.id,
                    solved: solvedIssues.length,
                    unsolved: unsolvedIssues.length,
                    waterLost: totalWaterLost,
                    avgSolveTime,
                    initialFlowRate,
                    stationStatus: stationStatus.totalStations > 0 ? stationStatus : null,
                },
            });
        }

        console.log("Daily reports generated for all managers");
    } catch (error) {
        console.error("Error generating daily reports:", error.message);
    }
};

// Schedule daily report generation at midnight
cron.schedule("0 0 * * *", () => {
    console.log("Generating daily reports...");
    generateDailyReportsForAllManagers();
});

export { generateDailyReport, getDailyReports };