import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// **Register Admin**
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, nationalId, location, companyName, companyEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: { name, email, password: hashedPassword, nationalId, location, companyName, companyEmail },
        });

        res.status(201).json({ message: "Admin registered successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error });
    }
};

// **Register Plumber**
const registerPlumber = async (req, res) => {
    try {
        const { name, email, password, nationalId, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const plumber = await prisma.plumber.create({
            data: { name, email, password: hashedPassword, nationalId, phone },
        });

        res.status(201).json({ message: "Plumber registered successfully", plumber });
    } catch (error) {
        res.status(500).json({ message: "Error registering plumber", error });
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
        res.status(500).json({ message: "Error logging in", error });
    }
};

export { registerAdmin, registerPlumber, loginUser };
