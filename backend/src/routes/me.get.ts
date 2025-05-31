import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getUserById } from "@/services/user.service.js";
import {getPrisma} from "@/lib/prisma.js";

export default async function (c: Context<AppEnv>) {
    try {
        const user = c.get("user");
        const userData = await getUserById(user.id);

        return c.json({
            success: true,
            message: 'User data retrieved successfully',
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name
            },
        });
    } catch (error: any) {
        return c.json({
            success: false,
            message: error.message || 'Failed to get user data'
        }, 400);
    }
}