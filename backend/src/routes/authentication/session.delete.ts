import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { clearAuthCookie } from "@/middleware/auth.middleware.js";

export default function (c: Context<AppEnv>) {
    clearAuthCookie(c);

    return c.json({
        success: true,
        message: 'Logout successful'
    });
}