import express from "express";
import { generateDailyReport, getDailyReport } from "../controllers/reportcontroller.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/reports:
 *   get:
 *     summary: Get the last 7 daily reports
 *     description: Retrieves the last 7 daily reports. Only accessible by admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: A list of the last 7 daily reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the report
 *                   totalChannels:
 *                     type: integer
 *                     description: The total number of channels managed
 *                   totalPlumbers:
 *                     type: integer
 *                     description: The total number of plumbers
 *                   newChannels:
 *                     type: integer
 *                     description: The number of new channels added on that day
 *                   newPlumbers:
 *                     type: integer
 *                     description: The number of new plumbers added on that day
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, isAdmin, getDailyReport);

/**
 * @openapi
 * /api/reports/generate:
 *   post:
 *     summary: Generate a new daily report
 *     description: Generates a new daily report for the system. Only accessible to admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: Daily report generated successfully
 *       400:
 *         description: Bad request (e.g., invalid data or issues with generation)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.post("/generate", verifyToken, isAdmin, generateDailyReport);

export default router;
