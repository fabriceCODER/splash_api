import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { sendNotification } from "../controllers/notificationcontroller.js";

const router = express.Router();

/**
 * @openapi
 * /api/notifications/send:
 *   post:
 *     summary: Send a notification
 *     description: Sends a notification to the relevant users. Only accessible to admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notification
 *               message:
 *                 type: string
 *                 description: The content/message of the notification
 *               recipients:
 *                 type: array
 *                 description: List of user IDs or group identifiers to send the notification to
 *                 items:
 *                   type: string
 *                   description: A recipient identifier
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.post("/send", verifyToken, isAdmin, sendNotification);

export default router;
