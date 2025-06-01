import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";
import {Context} from "hono";
import {calculateCurrentOpacity} from "@/lib/dairy.js";

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');
        const filter = c.req.query('filter') // 'all', 'fading', 'transformed'

        let whereClause: any = {userId}

        if (filter === 'fading') {
            whereClause.isFullyFaded = false
        } else if (filter === 'transformed') {
            whereClause.isFullyFaded = true
        }

        const entries = await prisma.diaryEntry.findMany({
            where: whereClause,
            orderBy: {createdAt: 'desc'},
        })

        // Calculate current opacity for each entry
        const entriesWithOpacity = await Promise.all(entries.map(async (entry) => {
            const currentOpacity = calculateCurrentOpacity(entry)

            // Update database if entry should be marked as fully faded
            if (currentOpacity <= 0.05 && !entry.isFullyFaded) {
                const updatedEntry = await prisma.diaryEntry.update({
                    where: {id: entry.id},
                    data: {
                        isFullyFaded: true,
                        currentOpacity: 0,
                        transformedAt: new Date() // Set transformation timestamp
                    }
                })
                return {...updatedEntry, currentOpacity: 0, isFullyFaded: true}
            }

            // Update current opacity in database
            if (Math.abs(entry.currentOpacity - currentOpacity) > 0.01) {
                await prisma.diaryEntry.update({
                    where: {id: entry.id},
                    data: {currentOpacity}
                })
            }

            return {...entry, currentOpacity}
        }))

        return c.json({entries: entriesWithOpacity})
    } catch (error) {
        console.error('Get entries error:', error)
        return c.json({error: 'Failed to fetch entries'}, 500)
    }
}