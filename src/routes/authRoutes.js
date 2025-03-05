import express from "express";
import { registerAdmin, registerPlumber, loginUser } from "../controllers/authController.js";

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
 *                 description: The name of the admin
 *               email:
 *                 type: string
 *                 description: The admin's email address
 *               password:
 *                 type: string
 *                 description: The password for the admin account
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
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
 *                 description: The name of the plumber
 *               email:
 *                 type: string
 *                 description: The plumber's email address
 *               phone:
 *                 type: string
 *                 description: The plumber's phone number
 *               password:
 *                 type: string
 *                 description: The password for the plumber account
 *     responses:
 *       201:
 *         description: Plumber registered successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
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
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
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
 *                   description: The authentication token
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       401:
 *         description: Unauthorized (e.g., invalid credentials)
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);

export default router;
