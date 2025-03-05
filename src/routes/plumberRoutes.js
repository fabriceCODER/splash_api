import express from "express";
import { createPlumber, getAllPlumbers, updatePlumber, deletePlumber } from "../controllers/plumberController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/plumbers:
 *   post:
 *     summary: Create a new plumber
 *     description: Creates a new plumber in the system. Only accessible to admins.
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
 *                 description: The name of the plumber
 *               email:
 *                 type: string
 *                 description: The email of the plumber
 *               phone:
 *                 type: string
 *                 description: The phone number of the plumber
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills of the plumber
 *     responses:
 *       201:
 *         description: Plumber created successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, isAdmin, createPlumber);

/**
 * @openapi
 * /api/plumbers:
 *   get:
 *     summary: Get all plumbers
 *     description: Retrieves a list of all plumbers. Requires user authentication.
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: A list of plumbers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The plumber's ID
 *                   name:
 *                     type: string
 *                     description: The plumber's name
 *                   email:
 *                     type: string
 *                     description: The plumber's email
 *                   phone:
 *                     type: string
 *                     description: The plumber's phone number
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The plumber's skills
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getAllPlumbers);

/**
 * @openapi
 * /api/plumbers/{id}:
 *   put:
 *     summary: Update a plumber's details
 *     description: Updates the information of an existing plumber. Only accessible to admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plumber to update
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
 *                 description: The name of the plumber
 *               email:
 *                 type: string
 *                 description: The email of the plumber
 *               phone:
 *                 type: string
 *                 description: The phone number of the plumber
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills of the plumber
 *     responses:
 *       200:
 *         description: Plumber updated successfully
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       404:
 *         description: Plumber not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken, isAdmin, updatePlumber);

/**
 * @openapi
 * /api/plumbers/{id}:
 *   delete:
 *     summary: Delete a plumber
 *     description: Deletes an existing plumber from the system. Only accessible to admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plumber to delete
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []  # Requires authentication with a bearer token
 *     responses:
 *       200:
 *         description: Plumber deleted successfully
 *       403:
 *         description: Forbidden (access restricted to admins)
 *       404:
 *         description: Plumber not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, isAdmin, deletePlumber);

export default router;
