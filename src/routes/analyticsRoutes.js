import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticscontroller.js";

const router = express.Router();

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     summary: Get analytics data
 *     description: Retrieves analytics data for the system. Only accessible by admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalChannels:
 *                   type: integer
 *                   description: The total number of channels
 *                 totalPlumbers:
 *                   type: integer
 *                   description: The total number of plumbers
 *                 newChannelsToday:
 *                   type: integer
 *                   description: The number of new channels added today
 *                 newPlumbersToday:
 *                   type: integer
 *                   description: The number of new plumbers added today
 *                 totalNotificationsSent:
 *                   type: integer
 *                   description: The total number of notifications sent
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, isAdmin, getAnalytics);

export default router;
