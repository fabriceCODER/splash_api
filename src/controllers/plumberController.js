import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPlumber = async (req, res) => {
    try {
        const { name, email, nationalId, phone } = req.body;
        const plumber = await prisma.plumber.create({ data: { name, email, nationalId, phone } });
        res.status(201).json(plumber);
    } catch (error) {
        res.status(500).json({ message: "Error creating plumber", error });
    }
};

export const getAllPlumbers = async (req, res) => {
    const plumbers = await prisma.plumber.findMany({ include: { channels: true } });
    res.json(plumbers);
};

export const updatePlumber = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedPlumber = await prisma.plumber.update({
        where: { id },
        data: { name, email, phone },
    });
    res.json(updatedPlumber);
};

export const deletePlumber = async (req, res) => {
    const { id } = req.params;
    await prisma.plumber.delete({ where: { id } });
    res.json({ message: "Plumber deleted successfully" });
};
