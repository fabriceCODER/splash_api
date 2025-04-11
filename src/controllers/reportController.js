import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

// Helper function to calculate report metrics for a manager's channels
const calculateReportMetrics = (channels) => {
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

    return {
        solved: solvedIssues.length,
        unsolved: unsolvedIssues.length,
        waterLost: totalWaterLost,
        avgSolveTime,
        initialFlowRate,
        stationStatus: stationStatus.totalStations > 0 ? stationStatus : null,
    };
};

// Generate a Daily Report for a Manager (manual trigger)
const generateDailyReport = async (req, res) => {
    try {
        const managerId = req.user.id; // Assuming req.user.id is the manager's ID

        // Fetch channels managed by this manager
        const channels = await prisma.channel.findMany({
            where: { managerId },
        });

        // Calculate report metrics
        const metrics = calculateReportMetrics(channels);

        // Create the daily report
        const report = await prisma.dailyReport.create({
            data: {
                managerId,
                ...metrics,
            },
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating daily report", error: error.message });
    }
};

// Get Daily Reports for a Manager
const getDailyReports = async (req, res) => {
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

            if (channels.length === 0) {
                console.log(`No channels found for manager ${manager.id}, skipping report.`);
                continue;
            }

            // Calculate report metrics
            const metrics = calculateReportMetrics(channels);

            // Create the daily report
            await prisma.dailyReport.create({
                data: {
                    managerId: manager.id,
                    ...metrics,
                },
            });

            console.log(`Daily report generated for manager ${manager.id}`);
        }

        console.log("Daily reports generation completed for all managers");
    } catch (error) {
        console.error("Error generating daily reports:", error.message);
    }
};

// Schedule daily report generation at midnight CAT (UTC+2)
// Since node-cron doesn't support time zones directly, schedule at 22:00 UTC (00:00 CAT)
cron.schedule("0 0 22 * * *", generateDailyReportsForAllManagers, {
    timezone: "UTC", 
});

// Export only the necessary functions
export { generateDailyReport, getDailyReports };