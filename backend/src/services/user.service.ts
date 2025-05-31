import bcrypt from "bcryptjs";
import {getPrisma} from "@/lib/prisma.js";

const prisma = getPrisma();

export type UserCreateInput = {
    email: string;
    password: string;
};

export type UserLoginInput = {
    email: string;
    password: string;
};

export const createUser = async ({ email, password }: UserCreateInput) => {
    
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            createdAt: new Date(),
        },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const validateUser = async ({ email, password }: UserLoginInput) => {
    
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error("User not found");
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};