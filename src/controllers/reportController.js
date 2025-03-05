import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Generate a Daily Report
export const generateDailyReport = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Fetch data related to leakages and issues
        const solvedIssues = await prisma.channel.findMany({
            where: { status: "solved", adminId },
        });

        const unsolvedIssues = await prisma.channel.findMany({
            where: { status: "unsolved", adminId },
        });

        // Calculate total water lost and average response time
        const totalWaterLost = solvedIssues.reduce((sum, issue) => sum + issue.waterLost, 0);
        const avgSolveTime = solvedIssues.length > 0
            ? solvedIssues.reduce((sum, issue) => sum + issue.solveTime, 0) / solvedIssues.length
            : 0;

        // Create the daily report
        const report = await prisma.dailyReport.create({
            data: {
                adminId,
                solved: solvedIssues.length,
                unsolved: unsolvedIssues.length,
                waterLost: totalWaterLost || 0,
                avgSolveTime: avgSolveTime || 0,
            },
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating daily report", error });
    }
};

// 📌 Get Daily Reports for Admin
export const getDailyReport = async (req, res) => {
    try {
        const adminId = req.user.id;

        const reports = await prisma.dailyReport.findMany({
            where: { adminId },
            orderBy: { createdAt: "desc" },
            take: 7, // Last 7 reports
        });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error });
    }
};
