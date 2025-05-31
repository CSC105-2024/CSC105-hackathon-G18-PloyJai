import type {Context, Next} from "hono";
import type {AppEnv} from "@/types/env.js";
import {sign, verify} from "hono/jwt";
import {getCookie, setCookie} from "hono/cookie";
import {getUserById} from "@/services/user.service.js";

export const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";
export const COOKIE_NAME = "auth_token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
};

const PUBLIC_PATHS = [
    '/authentication/sign-in',
    '/authentication/sign-up',
    '/authentication/session',
    '/',
];

export const setAuthCookie = async (c: Context<AppEnv>, payload: object) => {
    const token = await sign({...payload, exp: Math.floor(Date.now() / 1000) + cookieOptions.maxAge}, JWT_SECRET);
    setCookie(c, COOKIE_NAME, token, cookieOptions);
    return token;
};

export const clearAuthCookie = (c: Context<AppEnv>) => {
    setCookie(c, COOKIE_NAME, "", {...cookieOptions, maxAge: 0});
};

export const jwtMiddleware = async (c: Context<AppEnv>, next: Next) => {

    const path = c.req.path;
    const method = c.req.method;

    if (PUBLIC_PATHS.some(p => path === p) || method === 'OPTIONS') {
        return await next();
    }

    const token = getCookie(c, COOKIE_NAME);

    if (!token) {
        return c.json({
            success: false,
            message: 'Authentication required'
        }, 401);
    }

    try {
        const payload = await verify(token, JWT_SECRET);
        if (!payload) {
            return c.json({error: "Unauthorized"}, 401);
        }

        const user = await getUserById(payload.id as string);
        if (!user) {
            return c.json({error: "User not found"}, 401);
        }

        c.set("user", user);
        await next();
    } catch (error) {

        clearAuthCookie(c);
        return c.json({
            success: false,
            message: 'Invalid or expired authentication'
        }, 401);
    }
};