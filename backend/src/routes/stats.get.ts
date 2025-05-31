import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');

        const [totalEntries, totalPlants, fadingEntries] = await Promise.all([
            prisma.diaryEntry.count({ where: { userId } }),
            prisma.gardenPlant.count({ where: { userId } }),
            prisma.diaryEntry.count({ where: { userId, isFullyFaded: false } })
        ])

        // Calculate days active (days since first entry)
        const firstEntry = await prisma.diaryEntry.findFirst({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        })

        const daysActive = firstEntry
            ? Math.floor((new Date().getTime() - new Date(firstEntry.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 0

        return c.json({
            stats: {
                totalEntries,
                totalPlants,
                fadingEntries,
                daysActive,
                gardenBeauty: totalPlants > 0 ? Math.min(100, Math.floor((totalPlants / totalEntries) * 100)) : 0
            }
        })
    } catch (error) {
        console.error('Get stats error:', error)
        return c.json({ error: 'Failed to fetch stats' }, 500)
    }
}