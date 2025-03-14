import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";

dotenv.config();

const prisma = new PrismaClient();

// **Validation Schemas**
const adminSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    nationalId: z.string().optional(),
    location: z.string().optional(),
    companyName: z.string().optional(),
    companyEmail: z.string().optional(),
});

const plumberSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    nationalId: z.string().optional(),
    phone: z.string().optional(),
});

// **Register Admin**
const registerAdmin = async (req, res) => {
    try {
        const validatedData = adminSchema.parse(req.body);
        const existingAdmin = await prisma.admin.findUnique({ where: { email: validatedData.email } });

        if (existingAdmin) return res.status(400).json({ message: "Email already in use" });

        validatedData.password = await bcrypt.hash(validatedData.password, 10);

        const admin = await prisma.admin.create({ data: validatedData });

        res.status(201).json({ message: "Admin registered successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
};

// **Register Plumber**
const registerPlumber = async (req, res) => {
    try {
        const validatedData = plumberSchema.parse(req.body);
        const existingPlumber = await prisma.plumber.findUnique({ where: { email: validatedData.email } });

        if (existingPlumber) return res.status(400).json({ message: "Email already in use" });

        validatedData.password = await bcrypt.hash(validatedData.password, 10);

        const plumber = await prisma.plumber.create({ data: validatedData });

        res.status(201).json({ message: "Plumber registered successfully", plumber });
    } catch (error) {
        res.status(500).json({ message: "Error registering plumber", error: error.message });
    }
};

// **Login User (Admin or Plumber)**
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { email } });
        const plumber = await prisma.plumber.findUnique({ where: { email } });

        const user = admin || plumber;
        const role = admin ? "admin" : plumber ? "plumber" : null;

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

        const accessToken = generateAccessToken({ id: user.id, role });
        const refreshToken = generateRefreshToken({ id: user.id });

        // Store refresh token securely in the database
        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id },
        });

        res.status(200).json({ message: "Login successful", accessToken, refreshToken, role });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// **Refresh Token**
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
        if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ message: "Expired refresh token" });

            const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
};

// **Logout User**
const logoutUser = async (req, res) => {
    try {
        const { token } = req.body;
        await prisma.refreshToken.delete({ where: { token } });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};

// **Get Profile**
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.admin.findUnique({ where: { id: userId } }) ||
            await prisma.plumber.findUnique({ where: { id: userId } });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

export { registerAdmin, registerPlumber, loginUser, refreshToken, logoutUser, getProfile };
