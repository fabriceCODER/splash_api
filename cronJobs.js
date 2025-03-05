import cron from "node-cron";
import { generateDailyReport } from "./src/controllers/reportController.js";

// Schedule a job to run at midnight every day
cron.schedule("0 0 * * *", async () => {
    console.log("Generating daily report...");
    await generateDailyReport();
});
