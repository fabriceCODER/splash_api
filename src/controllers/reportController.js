import prisma from "@prisma/client";

export const generateDailyReport = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Fetch data to include in the report
        const solvedIssues = await prisma.issue.count({ where: { status: "solved" } });
        const unsolvedIssues = await prisma.issue.count({ where: { status: "unsolved" } });
        const totalWaterLost = await prisma.issue.aggregate({ _sum: { waterLost: true } });
        const avgSolveTime = await prisma.issue.aggregate({ _avg: { solveTime: true } });

        // Create the daily report
        const report = await prisma.dailyReport.create({
            data: {
                adminId,
                solved: solvedIssues,
                unsolved: unsolvedIssues,
                waterLost: totalWaterLost._sum.waterLost || 0,
                avgSolveTime: avgSolveTime._avg.solveTime || 0,
            },
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error generating daily report", error });
    }
};
