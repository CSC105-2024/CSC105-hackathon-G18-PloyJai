import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { validateUser } from "@/services/user.service.js";
import { setAuthCookie } from "@/middleware/auth.middleware.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});


export const middleware = [
    zValidator("json", signinSchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        // @ts-ignore
        const { email, password } = c.req.valid("json");
        const user = await validateUser({ email, password });

        await setAuthCookie(c, {id: user.id, email: user.email});

        return c.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error: any) {
        return c.json({
            success: false,
            message: error.message || 'Authentication failed'
        }, 401);
    }
}