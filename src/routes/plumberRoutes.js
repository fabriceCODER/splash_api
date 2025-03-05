import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "List of plumbers (Admin access only)" });
});

export default router;
