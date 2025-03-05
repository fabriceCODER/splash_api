import express from "express";
const router = express.Router();

/**
 * @openapi
 * /api/channels:
 *   get:
 *     summary: Get the list of channels
 *     description: Retrieves a list of all channels. Accessible by authenticated users.
 *     responses:
 *       200:
 *         description: A list of channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "List of channels"
 *       401:
 *         description: Unauthorized (no valid token provided)
 *       500:
 *         description: Internal server error
 */
router.get("/", (req, res) => {
    res.json({ message: "List of channels" });
});

export default router;
