import express from "express";
import { registerAdmin, registerPlumber, loginUser, getProfile, logoutUser } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js"; // Ensure this middleware exists

const router = express.Router();

/**
 * @openapi
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     description: Registers a new admin user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/admin/register", registerAdmin);

/**
 * @openapi
 * /api/plumber/register:
 *   post:
 *     summary: Register a new plumber
 *     description: Registers a new plumber user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plumber registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/plumber/register", registerPlumber);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     description: Returns profile details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/auth/me", authenticateUser, getProfile);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Logs out the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/auth/logout", authenticateUser, logoutUser);

export default router;
