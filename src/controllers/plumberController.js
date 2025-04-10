import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createPlumber = async (req, res) => {
    try {
        const { name, email, nationalId, phone, password, managerId } = req.body;

        // Validate required fields
        if (!name || !email || !nationalId || !phone || !password || !managerId) {
            return res.status(400).json({ 
                message: "Missing required fields: name, email, nationalId, phone, password, managerId" 
            });
        }

        // Check for unique constraints
        const existingPlumber = await prisma.plumber.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nationalId: nationalId }
                ]
            }
        });
        if (existingPlumber) {
            return res.status(400).json({ 
                message: `Plumber with this ${existingPlumber.email === email ? 'email' : 'national ID'} already exists` 
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const plumber = await prisma.plumber.create({
            data: {
                name,
                email,
                nationalId,
                phone,
                passwordHash,
                managerId,
            },
        });

        res.status(201).json(plumber);
    } catch (error) {
        res.status(500).json({ message: "Error creating plumber", error: error.message });
    }
};

export const getAllPlumbers = async (req, res) => {
    try {
        const plumbers = await prisma.plumber.findMany({
            include: {
                manager: true,
                assignedChannels: true, // Updated relation name from 'channels'
            },
        });
        res.json(plumbers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plumbers", error: error.message });
    }
};

export const updatePlumber = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, nationalId, phone, password, managerId } = req.body;

        // Check if plumber exists
        const plumber = await prisma.plumber.findUnique({ where: { id } });
        if (!plumber) {
            return res.status(404).json({ message: "Plumber not found" });
        }

        // Check for unique constraints if email or nationalId is being updated
        if (email !== plumber.email || nationalId !== plumber.nationalId) {
            const existingPlumber = await prisma.plumber.findFirst({
                where: {
                    OR: [
                        { email: email || plumber.email },
                        { nationalId: nationalId || plumber.nationalId }
                    ],
                    NOT: { id }
                }
            });
            if (existingPlumber) {
                return res.status(400).json({ 
                    message: `Another plumber with this ${existingPlumber.email === email ? 'email' : 'national ID'} already exists` 
                });
            }
        }

        // Hash new password if provided
        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedPlumber = await prisma.plumber.update({
            where: { id },
            data: {
                name: name || plumber.name,
                email: email || plumber.email,
                nationalId: nationalId || plumber.nationalId,
                phone: phone || plumber.phone,
                passwordHash: passwordHash || plumber.passwordHash,
                managerId: managerId || plumber.managerId,
            },
        });

        res.json(updatedPlumber);
    } catch (error) {
        res.status(500).json({ message: "Error updating plumber", error: error.message });
    }
};

export const deletePlumber = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if plumber exists
        const plumber = await prisma.plumber.findUnique({ where: { id } });
        if (!plumber) {
            return res.status(404).json({ message: "Plumber not found" });
        }

        await prisma.plumber.delete({ where: { id } });
        res.json({ message: "Plumber deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting plumber", error: error.message });
    }
};