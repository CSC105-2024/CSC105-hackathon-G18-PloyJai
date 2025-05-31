import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";

export default async function(c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');

        let settings = await prisma.fadeSettings.findUnique({
            where: { userId }
        })

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.fadeSettings.create({
                data: { userId }
            })
        }

        return c.json({ settings })
    } catch (error) {
        console.error('Get settings error:', error)
        return c.json({ error: 'Failed to fetch settings' }, 500)
    }
}