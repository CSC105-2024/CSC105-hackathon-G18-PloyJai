import { PrismaClient } from "@/prisma/generated/index.js";

export const getPrisma = () => {
    return new PrismaClient();
};