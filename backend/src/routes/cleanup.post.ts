import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {Context} from "hono";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";
import {calculateCurrentOpacityWithSettings, calculateFadeRateWithSettings} from "@/lib/dairy.js";

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const entries = await prisma.diaryEntry.findMany({
            where: {isFullyFaded: false}
        });

        const updatedEntries = [];
        const recalculatedEntries = [];

        for (const entry of entries) {
            const currentOpacity = await calculateCurrentOpacityWithSettings(entry);

            const newFadeRate = await calculateFadeRateWithSettings(
                entry.emotion,
                entry.emotionScore,
                entry.userId
            );

            let updateData: any = {
                currentOpacity,
                fadeRate: newFadeRate // Update stored fade rate to current settings
            };

            if (currentOpacity <= 0.05) {
                updateData = {
                    ...updateData,
                    isFullyFaded: true,
                    currentOpacity: 0,
                    transformedAt: new Date()
                };
                updatedEntries.push(entry.id);
            }

            await prisma.diaryEntry.update({
                where: {id: entry.id},
                data: updateData
            });

            if (Math.abs(entry.fadeRate - newFadeRate) > 0.01) {
                recalculatedEntries.push(entry.id);
            }
        }

        return c.json({
            message: 'Cleanup completed',
            fullyFadedEntries: updatedEntries.length,
            recalculatedEntries: recalculatedEntries.length,
            totalProcessed: entries.length
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return c.json({error: 'Cleanup failed'}, 500);
    }
}