import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getUserById } from "@/services/user.service.js";
import {getPrisma} from "@/lib/prisma.js";

export default async function (c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const user = c.get("user");
        const userData = await getUserById(user.id);

        const entries = await prisma.diaryEntry.findMany({
            where: {
                id: user.id,
            },
            orderBy: { createdAt: 'desc' },
        })

        const plants = await prisma.gardenPlant.findMany({
            where: {
                id: user.id,
            },
            include: {
                diaryEntry: {
                    select: {
                        emotion: true,
                        createdAt: true,
                        emotionScore: true
                    }
                }
            }
        })

        const daysActive = new Set(
            entries.map(entry =>
                new Date(entry.createdAt).toDateString()
            )
        ).size;

        return c.json({
            success: true,
            message: 'User data retrieved successfully',
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                gardenStats: {
                    totalEntries: entries?.length || 0,
                    totalPlants: plants?.length || 0,
                    daysActive: daysActive || 0
                }
            },
        });
    } catch (error: any) {
        return c.json({
            success: false,
            message: error.message || 'Failed to get user data'
        }, 400);
    }
}