import express from "express";
import { verifyToken, isPlumber } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isPlumber, (req, res) => {
    res.json({ message: "Real-time notifications for plumbers only" });
});

export default router;
