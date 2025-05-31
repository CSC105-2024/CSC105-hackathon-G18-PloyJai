import type { Context } from "hono";
import { jwtMiddleware } from "@/middleware/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";
import bcrypt from "bcryptjs";

export const middleware = [
  jwtMiddleware
];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const userPayload = c.get("user"); 
        const body = await c.req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return c.json(
                {
                    success: false,
                    error: "Current password and new password are required",
                },
                400
            );
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userPayload.id },
        });

        if (!currentUser) {
            return c.json({ success: false, error: "User not found" }, 404);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isPasswordValid) {
            return c.json({ success: false, error: "Current password is incorrect" }, 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userPayload.id },
            data: { password: hashedPassword },
        });

        return c.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
}
