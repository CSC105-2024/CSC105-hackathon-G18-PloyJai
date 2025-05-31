import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";
import {calculateCurrentOpacity} from "@/lib/dairy.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const entries = await prisma.diaryEntry.findMany({
            where: { isFullyFaded: false }
        })

        const updatedEntries = []
        for (const entry of entries) {
            const currentOpacity = calculateCurrentOpacity(entry)
            if (currentOpacity <= 0.05) {
                await prisma.diaryEntry.update({
                    where: { id: entry.id },
                    data: {
                        isFullyFaded: true,
                        currentOpacity: 0,
                        transformedAt: new Date()
                    }
                })
                updatedEntries.push(entry.id)
            } else {
                await prisma.diaryEntry.update({
                    where: { id: entry.id },
                    data: { currentOpacity }
                })
            }
        }

        return c.json({
            message: 'Cleanup completed',
            updatedEntries: updatedEntries.length
        })
    } catch (error) {
        console.error('Cleanup error:', error)
        return c.json({ error: 'Cleanup failed' }, 500)
    }
}