import express from "express";
import { createChannel, getAllChannels, updateChannel, deleteChannel } from "../controllers/channelController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createChannel);
router.get("/", verifyToken, getAllChannels);
router.put("/:id", verifyToken, isAdmin, updateChannel);
router.delete("/:id", verifyToken, isAdmin, deleteChannel);

export default router;
