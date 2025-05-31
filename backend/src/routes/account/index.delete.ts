import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";
import { jwtMiddleware } from "@/middleware/auth.middleware.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    const prisma = getPrisma();
    const user = c.get("user");

    if (!user) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    try {
        await prisma.user.delete({
            where: { id: user.id },
        });

        return c.json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return c.json(
            { success: false, message: "Failed to delete account" },
            500
        );
    }
}