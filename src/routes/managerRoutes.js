// src/routes/managerRoutes.js
import express from "express";
import { getAnalytics, getPlumbers, getChannels } from "../controllers/managerController.js";
import { authenticateUser, isManager } from "../middlewares/authMiddleware.js"; // Corrected path

const router = express.Router();

/**
 * @route GET /api/manager/analytics
 * @desc Get analytics for channels managed by the authenticated Manager
 * @access Private (Manager only)
 */
router.get("/analytics", authenticateUser, isManager, getAnalytics);

/**
 * @route GET /api/manager/plumbers
 * @desc Get all plumbers managed by the authenticated Manager
 * @access Private (Manager only)
 */
router.get("/plumbers", authenticateUser, isManager, getPlumbers);

/**
 * @route GET /api/manager/channels
 * @desc Get all channels managed by the authenticated Manager
 * @access Private (Manager only)
 */
router.get("/channels", authenticateUser, isManager, getChannels);

// /**
//  * @route POST /api/manager/assign-plumber
//  * @desc Assign a plumber to a channel
//  * @access Private (Manager only)
//  */
// router.post("/assign-plumber", authenticateUser, isManager, assignPlumber);

export default router;