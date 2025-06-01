import {getGemini} from "@/lib/gemini.js";
import {EmotionAnalysis} from "@/types/diary.js";
import {getPrisma} from "@/lib/prisma.js";
import {EmotionType} from "@/prisma/generated/index.js";

const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
    try {
        const prompt = `
    Analyze the emotional content of the following text and return ONLY a JSON response with no additional text:

    Text: "${text}"

    Analyze the dominant emotion and return it in this exact format:
    {
      "emotion": "ANGER|SADNESS|ANXIETY|JOY|LOVE|FEAR|HOPE|NEUTRAL",
      "intensity": 0.0-1.0,
      "confidence": 0.0-1.0
    }
    
    Definitions:
    - intensity: A measure of the strength or magnitude of the emotion expressed in the text, ranging from 0.0 (barely perceptible) to 1.0 (extremely intense).
    - confidence: A measure of the AI’s certainty in its assessment of the dominant emotion, ranging from 0.0 (very low confidence) to 1.0 (very high confidence).
    
    Guidelines:
    - ANGER: rage, fury, irritation, annoyance
    - SADNESS: grief, sorrow, depression, melancholy
    - ANXIETY: worry, stress, nervousness, panic
    - JOY: happiness, excitement, delight, pleasure
    - LOVE: affection, romantic feelings, care, warmth
    - FEAR: terror, phobia, dread, apprehension
    - HOPE: optimism, faith, expectation, aspiration
    - NEUTRAL: calm, balanced, factual, mundane
    
    Example Intensity Levels:
    - 0.0 (No intensity): "She simply stated her opinion without any hint of emotion."
    - 0.2 (Very low intensity): "She felt a mild sense of annoyance but quickly let it go."
    - 0.4 (Low intensity): "She was a bit irritated by the noise, but it didn’t really bother her."
    - 0.6 (Moderate intensity): "She felt quite frustrated by the constant interruptions."
    - 0.8 (High intensity): "Her anger was boiling over, and she could barely contain herself."
    - 1.0 (Extreme intensity): "She was absolutely furious, screaming and throwing things across the room."
    
    Return only the JSON object.
    `

        const genAi = getGemini();
        const result = await genAi.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: prompt,
        })
        const response = result.text;
        if (!response) {
            throw new Error('No response found for the following prompt');
        }

        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response')
        }

        const analysis = JSON.parse(jsonMatch[0])

        const validEmotions = ['ANGER', 'SADNESS', 'ANXIETY', 'JOY', 'LOVE', 'FEAR', 'HOPE', 'NEUTRAL']
        if (!validEmotions.includes(analysis.emotion)) {
            analysis.emotion = 'NEUTRAL'
        }

        analysis.intensity = Math.max(0, Math.min(1, analysis.intensity || 0.5))
        analysis.confidence = Math.max(0, Math.min(1, analysis.confidence || 0.5))

        return analysis
    } catch (error) {
        console.error('Emotion analysis error:', error)
        return {
            emotion: 'NEUTRAL',
            intensity: 0.5,
            confidence: 0.3
        }
    }
}

const calculateFadeRateWithSettings = async (
    emotion: EmotionType,
    intensity: number,
    userId: string
): Promise<number> => {
    const prisma = getPrisma();

    try {
        let fadeSettings = await prisma.fadeSettings.findUnique({
            where: {userId}
        });

        if (!fadeSettings) {
            fadeSettings = await prisma.fadeSettings.create({
                data: {userId}
            });
        }

        const emotionFadeRates = {
            ANGER: fadeSettings.angerFadeRate,
            SADNESS: fadeSettings.sadnessFadeRate,
            ANXIETY: fadeSettings.anxietyFadeRate,
            JOY: fadeSettings.joyFadeRate,
            FEAR: fadeSettings.fearFadeRate,
            LOVE: fadeSettings.loveFadeRate,
            HOPE: fadeSettings.hopeFadeRate,
            NEUTRAL: fadeSettings.neutralFadeRate,
        };

        // @ts-ignore
        const baseFadeRate = emotionFadeRates[emotion];
        const isPositiveEmotion = ['JOY', 'LOVE', 'HOPE'].includes(emotion);

        let finalFadeRate;
        if (isPositiveEmotion) {
            finalFadeRate = baseFadeRate * (2 - intensity);
        } else {
            finalFadeRate = baseFadeRate * (0.5 + intensity);
        }

        return Math.max(0.1, finalFadeRate); // Minimum fade rate of 0.1
    } catch (error) {
        console.error('Error fetching fade settings:', error);
        return calculateFadeRate(emotion, intensity);
    }
}


const calculateFadeRate = (emotion: string, intensity: number): number => {
    const baseRates = {
        ANGER: 2.0,
        SADNESS: 1.5,
        ANXIETY: 1.8,
        JOY: 0.3,
        LOVE: 0.2,
        FEAR: 1.7,
        HOPE: 0.4,
        NEUTRAL: 1.0
    }

    const baseRate = baseRates[emotion as keyof typeof baseRates] || 1.0
    return baseRate * (0.5 + intensity * 0.5) // Scale by intensity
}

const calculateCurrentOpacity = (entry: any): number => {
    const now = new Date()
    const fadeStart = new Date(entry.fadeStartDate)
    const hoursPassed = (now.getTime() - fadeStart.getTime()) / (1000 * 60 * 60)

    // Base calculation: fade over time
    const fadeProgress = hoursPassed / (24 * 7) // 7 days base
    const adjustedFadeProgress = fadeProgress * entry.fadeRate

    // Accelerate fade based on view count
    const viewPenalty = entry.viewCount * 0.05

    const opacity = Math.max(0, 1 - adjustedFadeProgress - viewPenalty)
    return opacity
}

const calculateCurrentOpacityWithSettings = async (entry: any): Promise<number> => {
    const prisma = getPrisma();

    let fadeSettings = await prisma.fadeSettings.findUnique({
        where: {userId: entry.userId}
    });

    if (!fadeSettings) {
        fadeSettings = await prisma.fadeSettings.create({
            data: {userId: entry.userId}
        });
    }

    const emotionFadeRates = {
        ANGER: fadeSettings.angerFadeRate,
        SADNESS: fadeSettings.sadnessFadeRate,
        ANXIETY: fadeSettings.anxietyFadeRate,
        JOY: fadeSettings.joyFadeRate,
        FEAR: fadeSettings.fearFadeRate,
        LOVE: fadeSettings.loveFadeRate,
        HOPE: fadeSettings.hopeFadeRate,
        NEUTRAL: fadeSettings.neutralFadeRate,
    };

    // @ts-ignore
    const baseFadeRate = emotionFadeRates[entry.emotion] || 1.0;

    const isPositiveEmotion = ['JOY', 'LOVE', 'HOPE'].includes(entry.emotion);
    let currentFadeRate;

    if (isPositiveEmotion) {
        currentFadeRate = baseFadeRate * (2 - entry.emotionScore);
    } else {
        currentFadeRate = baseFadeRate * (0.5 + entry.emotionScore);
    }

    currentFadeRate = Math.max(0.1, currentFadeRate);

    // Calculate opacity using current fade settings
    const now = new Date();
    const fadeStart = new Date(entry.fadeStartDate);
    const hoursPassed = (now.getTime() - fadeStart.getTime()) / (1000 * 60 * 60);

    const fadeProgress = hoursPassed / (24 * 7); // 7 days base
    const adjustedFadeProgress = fadeProgress * currentFadeRate;
    const viewPenalty = entry.viewCount * 0.05;

    const opacity = Math.max(0, 1 - adjustedFadeProgress - viewPenalty);
    return opacity;
};

export {
    analyzeEmotion,
    calculateFadeRate,
    calculateCurrentOpacity,
    calculateFadeRateWithSettings,
    calculateCurrentOpacityWithSettings
};