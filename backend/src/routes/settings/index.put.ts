import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');
        const settingsData = await c.req.json()

        const settings = await prisma.fadeSettings.upsert({
            where: {userId},
            update: settingsData,
            create: {
                userId,
                ...settingsData
            }
        })

        return c.json({
            message: 'Settings updated successfully',
            settings
        })
    } catch (error) {
        console.error('Update settings error:', error)
        return c.json({error: 'Failed to update settings'}, 500)
    }
}