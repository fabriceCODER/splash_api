import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authmiddleware.js";
import { getDailyReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getDailyReport);

export default router;
