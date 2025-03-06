import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod"; // For input validation

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

        const token = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token, role });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// **Get Profile**
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from `authenticateUser` middleware
        const user = await prisma.admin.findUnique({ where: { id: userId } }) ||
            await prisma.plumber.findUnique({ where: { id: userId } });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// **Logout User**
const logoutUser = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
};

export { registerAdmin, registerPlumber, loginUser, getProfile, logoutUser };
