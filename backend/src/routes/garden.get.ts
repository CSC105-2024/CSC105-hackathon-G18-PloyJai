import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import type {Context} from "hono";
import type {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.ts";
import {Prisma} from "@/prisma/generated/index.js";
import GardenPlantCreateManyInput = Prisma.GardenPlantCreateManyInput;

export const middleware = [jwtMiddleware];

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const {id: userId} = c.get('user');

        const transformedEntries = await prisma.diaryEntry.findMany({
            where: {
                userId,
                isFullyFaded: true
            },
            include: {
                gardenPlant: true
            }
        })

        // Create plants for entries that don't have them yet
        const plantsToCreate = []
        for (const entry of transformedEntries) {
            if (!entry.gardenPlant) {
                const plantType = {
                    JOY: 'FLOWER',
                    LOVE: 'FLOWER',
                    HOPE: 'CRYSTAL',
                    SADNESS: 'TREE',
                    ANGER: 'CRYSTAL',
                    ANXIETY: 'SUCCULENT',
                    FEAR: 'MOSS',
                    NEUTRAL: 'VINE'
                }[entry.emotion] || 'FLOWER'

                plantsToCreate.push({
                    userId,
                    diaryEntryId: entry.id,
                    plantType,
                    growthStage: Math.min(5, Math.max(1, Math.floor(entry.emotionScore * 5) + 1)),
                    color: {
                        JOY: '#FFD700',
                        LOVE: '#FFB6C1',
                        HOPE: '#DDA0DD',
                        SADNESS: '#87CEEB',
                        ANGER: '#FF6B6B',
                        ANXIETY: '#98FB98',
                        FEAR: '#90EE90',
                        NEUTRAL: '#E6E6FA'
                    }[entry.emotion] || '#98FB98',
                    size: 0.8 + (entry.emotionScore * 0.4),
                    beauty: entry.emotionScore,
                    positionX: Math.random() * 80 + 10, // 10-90%
                    positionY: Math.random() * 60 + 20, // 20-80%
                })
            }
        }

        if (plantsToCreate.length > 0) {
            await prisma.gardenPlant.createMany({
                data: plantsToCreate as GardenPlantCreateManyInput[]
            })
        }

        const plants = await prisma.gardenPlant.findMany({
            where: {userId},
            include: {
                diaryEntry: {
                    select: {
                        emotion: true,
                        createdAt: true,
                        emotionScore: true,
                        transformedAt: true,
                    }
                }
            }
        })

        return c.json({plants})
    } catch (error) {
        console.error('Get garden error:', error)
        return c.json({error: 'Failed to fetch garden'}, 500)
    }
}