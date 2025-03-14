import { Prisma } from "@prisma/client";

// Get User Profile
const getUserProfile = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
    });
};

// Batch Queries for Dashboard Analytics
const getDashboardStats = async () => {
    return await prisma.$transaction([
        prisma.user.count(),
        prisma.article.count(),
    ]);
};

module.exports = { getUserProfile, getDashboardStats };

