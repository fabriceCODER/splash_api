// src/routes/adminRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/admin/managers:
 *   get:
 *     summary: Get all managers
 *     description: Retrieves a list of all managers and their basic details. Accessible only by authenticated Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of managers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "manager123"
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   email:
 *                     type: string
 *                     example: "jane.doe@example.com"
 *                   companyName:
 *                     type: string
 *                     example: "WaterWorks Inc."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-11T10:00:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/managers", authenticateUser, isAdmin, async (req, res) => {
    try {
        const managers = await prisma.manager.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                companyName: true,
                createdAt: true,
            },
        });
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).json({ message: "Failed to fetch managers", error: error.message });
    }
});

/**
 * @openapi
 * /api/admin/managers/{managerId}/channels:
 *   get:
 *     summary: Get channels managed by a specific manager
 *     description: Retrieves a list of channels managed by the specified manager. Accessible only by authenticated Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manager
 *     responses:
 *       200:
 *         description: A list of channels managed by the manager
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Channel'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Manager not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/managers/:managerId/channels", authenticateUser, isAdmin, async (req, res) => {
    try {
        const { managerId } = req.params;

        // Verify manager exists
        const manager = await prisma.manager.findUnique({
            where: { id: managerId },
        });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const channels = await prisma.channel.findMany({
            where: { managerId },
            include: {
                plumber: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(channels);
    } catch (error) {
        console.error("Error fetching manager channels:", error);
        res.status(500).json({ message: "Failed to fetch channels", error: error.message });
    }
});

/**
 * @openapi
 * /api/admin/managers:
 *   post:
 *     summary: Create a new manager
 *     description: Creates a new manager under the admin's control. Accessible only by authenticated Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - companyName
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *               companyName:
 *                 type: string
 *                 example: "WaterWorks Inc."
 *     responses:
 *       201:
 *         description: Manager created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "manager123"
 *                 name:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   example: "jane.doe@example.com"
 *                 companyName:
 *                   type: string
 *                   example: "WaterWorks Inc."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-11T10:00:00Z"
 *       400:
 *         description: Bad request - Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/managers", authenticateUser, isAdmin, async (req, res) => {
    try {
        const { name, email, password, companyName } = req.body;

        if (!name || !email || !password || !companyName) {
            return res.status(400).json({ message: "Missing required fields: name, email, password, companyName" });
        }

        // Check if email already exists
        const existingManager = await prisma.manager.findUnique({
            where: { email },
        });
        if (existingManager) {
            return res.status(400).json({ message: "Manager with this email already exists" });
        }

        // Hash password (assuming bcrypt is used elsewhere, add it here if needed)
        const passwordHash = await import("bcryptjs").then(bcrypt => bcrypt.hash(password, 10));

        const manager = await prisma.manager.create({
            data: {
                name,
                email,
                passwordHash,
                companyName,
            },
        });

        res.status(201).json(manager);
    } catch (error) {
        console.error("Error creating manager:", error);
        res.status(500).json({ message: "Failed to create manager", error: error.message });
    }
});

export default router;