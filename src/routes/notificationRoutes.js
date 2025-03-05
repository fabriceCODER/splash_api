import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { sendNotification } from "../controllers/notificationcontroller.js";

const router = express.Router();

router.post("/send", verifyToken, isAdmin, sendNotification);

export default router;
