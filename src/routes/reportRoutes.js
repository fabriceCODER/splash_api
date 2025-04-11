import express from "express";
import { generateDailyReport, getDailyReports } from "../controllers/reportcontroller.js"; // Fixed import
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/reports:
 *   get:
 *     summary: Get the last 7 daily reports
 *     description: Retrieves the last 7 daily reports for the authenticated manager. Only accessible by admins.
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
 *                   id:
 *                     type: integer
 *                     description: The report ID
 *                   managerId:
 *                     type: integer
 *                     description: The ID of the manager
 *                   solved:
 *                     type: integer
 *                     description: Number of solved issues
 *                   unsolved:
 *                     type: integer
 *                     description: Number of unsolved issues
 *                   waterLost:
 *                     type: number
 *                     description: Total water lost
 *                   avgSolveTime:
 *                     type: number
 *                     description: Average solve time for issues
 *                   initialFlowRate:
 *                     type: number
 *                     description: Average initial flow rate
 *                   stationStatus:
 *                     type: object
 *                     description: Station status summary
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the report was created
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, isAdmin, getDailyReports); // Fixed function name

/**
 * @openapi
 * /api/reports/generate:
 *   post:
 *     summary: Generate a new daily report
 *     description: Generates a new daily report for the authenticated manager. Only accessible to admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       201:
 *         description: Daily report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The report ID
 *                 managerId:
 *                   type: integer
 *                   description: The ID of the manager
 *                 solved:
 *                   type: integer
 *                   description: Number of solved issues
 *                 unsolved:
 *                   type: integer
 *                   description: Number of unsolved issues
 *                 waterLost:
 *                   type: number
 *                   description: Total water lost
 *                 avgSolveTime:
 *                   type: number
 *                   description: Average solve time for issues
 *                 initialFlowRate:
 *                   type: number
 *                   description: Average initial flow rate
 *                 stationStatus:
 *                   type: object
 *                   description: Station status summary
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date the report was created
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.post("/generate", verifyToken, isAdmin, generateDailyReport);

export default router;