import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { createUser } from "@/services/user.service.js";
import { setAuthCookie } from "@/middleware/auth.middleware.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rePassword: z.string().min(1)
}).refine(data => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"]
});


export const middleware = [
    zValidator("json", signupSchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        // @ts-ignore
        const { email, password } = c.req.valid("json");
        const user = await createUser({ email, password });

        await setAuthCookie(c, {id: user.id, email: user.email});

        return c.json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error: any) {
        return c.json({
            success: false,
            message: error.message || 'Registration failed'
        }, 400);
    }
}