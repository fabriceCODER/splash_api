import express from "express";
import { createPlumber, getAllPlumbers, updatePlumber, deletePlumber } from "../controllers/plumberController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createPlumber);
router.get("/", verifyToken, getAllPlumbers);
router.put("/:id", verifyToken, isAdmin, updatePlumber);
router.delete("/:id", verifyToken, isAdmin, deletePlumber);

export default router;

