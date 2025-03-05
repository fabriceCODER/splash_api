import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

const generateDailyReport = async () => {
    try {
        console.log("🔄 Generating daily report...");

        const admins = await prisma.admin.findMany();

        for (const admin of admins) {
            const channels = await prisma.channel.findMany({
                where: { adminId: admin.id },
                include: { issues: true },
            });

            let solved = 0;
            let unsolved = 0;
            let totalWaterLost = 0;
            let totalSolveTime = 0;
            let resolvedIssues = 0;

            for (const channel of channels) {
                for (const issue of channel.issues) {
                    if (issue.status === "solved") {
                        solved++;
                        const timeTaken = moment(issue.solvedAt).diff(moment(issue.createdAt), "hours");
                        totalSolveTime += timeTaken;
                        resolvedIssues++;
                    } else {
                        unsolved++;
                    }
                    totalWaterLost += issue.waterLost;
                }
            }

            const avgSolveTime = resolvedIssues > 0 ? totalSolveTime / resolvedIssues : 0;

            await prisma.dailyReport.create({
                data: {
                    adminId: admin.id,
                    solved,
                    unsolved,
                    waterLost: totalWaterLost,
                    avgSolveTime,
                },
            });

            console.log(`✅ Report for Admin ${admin.email} generated.`);
        }
    } catch (error) {
        console.error("❌ Error generating report:", error);
    }
};

// Schedule the job to run at midnight every day
cron.schedule("0 0 * * *", generateDailyReport);
