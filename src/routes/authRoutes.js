import express from "express";
import { registerAdmin, registerPlumber, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/plumber/register", registerPlumber);
router.post("/login", loginUser);

export default router;
