import express from "express";
import { generateDailyReport, getDailyReport } from "../controllers/reportcontroller.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getDailyReport);
router.post("/generate", verifyToken, isAdmin, generateDailyReport);

export default router;
