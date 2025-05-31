import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import type {Context} from "hono";
import type {AppEnv} from "@/types/env.js";
import {analyzeEmotion, calculateFadeRate} from "@/lib/dairy.js";
import {getPrisma} from "@/lib/prisma.js";

export const middleware = [jwtMiddleware];

export default async function(c: Context<AppEnv>) {
    try {
        const prisma = getPrisma();
        const { id: userId } = c.get('user');
        const { content, title } = await c.req.json()

        if (!content || content.trim().length === 0) {
            return c.json({ error: 'Content is required' }, 400)
        }

        const emotionAnalysis = await analyzeEmotion(content)
        const fadeRate = calculateFadeRate(emotionAnalysis.emotion, emotionAnalysis.intensity)

        const entry = await prisma.diaryEntry.create({
            data: {
                userId,
                content,
                title: title || null,
                emotion: emotionAnalysis.emotion,
                emotionScore: emotionAnalysis.intensity,
                fadeRate,
                currentOpacity: 1.0,
            }
        })

        return c.json({
            message: 'Entry created successfully',
            entry: {
                ...entry,
                emotionAnalysis
            }
        })
    } catch (error) {
        console.error('Create entry error:', error)
        return c.json({ error: 'Failed to create entry' }, 500)
    }
}