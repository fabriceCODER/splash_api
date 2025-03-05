import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDailyReport = async (req, res) => {
    try {
        const adminId = req.user.id;

        const reports = await prisma.dailyReport.findMany({
            where: { adminId },
            orderBy: { date: "desc" },
            take: 7, // Last 7 reports
        });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error });
    }
};
