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
    phoneNumber: z.string(), // Added required field from schema
    password: z.string().min(6),
});

const managerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    nationalId: z.string(),
    phone: z.string(),
    location: z.string(),
    companyName: z.string(),
    companyEmail: z.string().email(),
    password: z.string().min(6),
    adminId: z.string(),
});

const plumberSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    nationalId: z.string(), 
    phone: z.string(),      // Required in schema
    password: z.string().min(6),
    managerId: z.string(),  // Required relation
});

// **Register Admin**
const registerAdmin = async (req, res) => {
    try {
        const validatedData = adminSchema.parse(req.body);
        const existingAdmin = await prisma.admin.findUnique({ where: { email: validatedData.email } });
        if (existingAdmin) return res.status(400).json({ message: "Email already in use" });

        const passwordHash = await bcrypt.hash(validatedData.password, 10);
        const admin = await prisma.admin.create({ 
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phoneNumber: validatedData.phoneNumber,
                passwordHash,
            }
        });

        res.status(201).json({ message: "Admin registered successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
};

// **Register Manager**
const registerManager = async (req, res) => {
    try {
        const validatedData = managerSchema.parse(req.body);
        const existingManager = await prisma.manager.findUnique({ where: { email: validatedData.email } });
        if (existingManager) return res.status(400).json({ message: "Email already in use" });

        const passwordHash = await bcrypt.hash(validatedData.password, 10);
        const manager = await prisma.manager.create({ 
            data: {
                name: validatedData.name,
                email: validatedData.email,
                nationalId: validatedData.nationalId,
                phone: validatedData.phone,
                location: validatedData.location,
                companyName: validatedData.companyName,
                companyEmail: validatedData.companyEmail,
                passwordHash,
                adminId: validatedData.adminId,
            }
        });

        res.status(201).json({ message: "Manager registered successfully", manager });
    } catch (error) {
        res.status(500).json({ message: "Error registering manager", error: error.message });
    }
};

// **Register Plumber**
const registerPlumber = async (req, res) => {
    try {
        const validatedData = plumberSchema.parse(req.body);
        const existingPlumber = await prisma.plumber.findUnique({ where: { email: validatedData.email } });
        if (existingPlumber) return res.status(400).json({ message: "Email already in use" });

        const passwordHash = await bcrypt.hash(validatedData.password, 10);
        const plumber = await prisma.plumber.create({ 
            data: {
                name: validatedData.name,
                email: validatedData.email,
                nationalId: validatedData.nationalId,
                phone: validatedData.phone,
                passwordHash,
                managerId: validatedData.managerId,
            }
        });

        res.status(201).json({ message: "Plumber registered successfully", plumber });
    } catch (error) {
        res.status(500).json({ message: "Error registering plumber", error: error.message });
    }
};

// **Login User (Admin, Manager, or Plumber)**
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        const manager = await prisma.manager.findUnique({ where: { email } });
        const plumber = await prisma.plumber.findUnique({ where: { email } });
        const user = admin || manager || plumber;
        const role = admin ? "admin" : manager ? "manager" : plumber ? "plumber" : null;

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

        const accessToken = generateAccessToken({ id: user.id, role });
        const refreshToken = generateRefreshToken({ id: user.id });

        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

        res.status(200).json({ message: "Login successful", accessToken, refreshToken, role });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// **Refresh Token** (unchanged)
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
        if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });

        try {
            const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
            res.json({ accessToken: newAccessToken });
        } catch (error) {
            await prisma.refreshToken.delete({ where: { token } });
            return res.status(403).json({ message: "Expired refresh token" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
};

// **Logout User** (unchanged)
const logoutUser = async (req, res) => {
    try {
        const { token } = req.body;
        const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
        if (!storedToken) return res.status(400).json({ message: "Token already invalid or does not exist" });

        await prisma.refreshToken.delete({ where: { token } });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};

// **Get Profile**
const getProfile = async (req, res) => {
    try {
        const user = await prisma.admin.findFirst({ where: { id: req.user.id } }) || 
                     await prisma.manager.findFirst({ where: { id: req.user.id } }) ||
                     await prisma.plumber.findFirst({ where: { id: req.user.id } });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

export { registerAdmin, registerManager, registerPlumber, loginUser, refreshToken, logoutUser, getProfile };