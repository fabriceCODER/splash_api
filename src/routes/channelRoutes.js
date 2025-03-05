import express from "express";
import { createChannel, getAllChannels, updateChannel, deleteChannel } from "../controllers/channelController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/channels:
 *   post:
 *     summary: Create a new channel
 *     description: Creates a new channel in the system. Only accessible to admins.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the channel
 *               description:
 *                 type: string
 *                 description: The description of the channel
 *               status:
 *                 type: string
 *                 description: The status of the channel (active, inactive)
 *     responses:
 *       201:
 *         description: Channel created successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, isAdmin, createChannel);

/**
 * @openapi
 * /api/channels:
 *   get:
 *     summary: Get all channels
 *     description: Retrieves a list of all channels. Requires user authentication.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: A list of channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The channel's ID
 *                   name:
 *                     type: string
 *                     description: The channel's name
 *                   description:
 *                     type: string
 *                     description: The channel's description
 *                   status:
 *                     type: string
 *                     description: The channel's status
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getAllChannels);

/**
 * @openapi
 * /api/channels/{id}:
 *   put:
 *     summary: Update a channel
 *     description: Updates an existing channel's information. Only accessible to admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the channel to update
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the channel
 *               description:
 *                 type: string
 *                 description: The description of the channel
 *               status:
 *                 type: string
 *                 description: The status of the channel (active, inactive)
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken, isAdmin, updateChannel);

/**
 * @openapi
 * /api/channels/{id}:
 *   delete:
 *     summary: Delete a channel
 *     description: Deletes an existing channel. Only accessible to admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the channel to delete
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, isAdmin, deleteChannel);

export default router;
