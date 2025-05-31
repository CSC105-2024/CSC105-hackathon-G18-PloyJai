import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";
import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {calculateCurrentOpacity} from "@/lib/dairy.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');
        const entryId = c.req.param('id')

        const entry = await prisma.diaryEntry.findFirst({
            where: {
                id: entryId,
                userId
            }
        })

        if (!entry) {
            return c.json({ error: 'Entry not found' }, 404)
        }

        // Update view count and last viewed time
        const updatedEntry = await prisma.diaryEntry.update({
            where: { id: entryId },
            data: {
                viewCount: { increment: 1 },
                lastViewedAt: new Date()
            }
        })

        // Calculate current opacity
        const entryWithOpacity = {
            ...updatedEntry,
            currentOpacity: calculateCurrentOpacity(updatedEntry)
        }

        return c.json({ entry: entryWithOpacity })
    } catch (error) {
        console.error('Get entry error:', error)
        return c.json({ error: 'Failed to fetch entry' }, 500)
    }
}