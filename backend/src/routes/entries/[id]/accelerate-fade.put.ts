import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.ts";
import {calculateCurrentOpacity} from "@/lib/dairy.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user')
        const entryId = c.req.param('id')

        const entry = await prisma.diaryEntry.findFirst({
            where: {
                id: entryId,
                userId
            }
        })

        if (!entry) {
            return c.json({error: 'Entry not found'}, 404)
        }

        // Accelerate fade by increasing view count significantly
        const updatedEntry = await prisma.diaryEntry.update({
            where: {id: entryId},
            data: {
                viewCount: {increment: 5}, // Accelerate fade
                lastViewedAt: new Date()
            }
        })

        const entryWithOpacity = {
            ...updatedEntry,
            currentOpacity: calculateCurrentOpacity(updatedEntry)
        }

        return c.json({
            message: 'Fade accelerated successfully',
            entry: entryWithOpacity
        })
    } catch (error) {
        console.error('Accelerate fade error:', error)
        return c.json({error: 'Failed to accelerate fade'}, 500)
    }
}