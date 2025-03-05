import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticscontroller.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAnalytics);

export default router;
