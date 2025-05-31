import {getGemini} from "@/lib/gemini.js";
import {EmotionAnalysis} from "@/types/diary.js";

const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
    try {
        const prompt = `
    Analyze the emotional content of the following text and return ONLY a JSON response with no additional text:

    Text: "${text}"

    Analyze the dominant emotion and return in this exact format:
    {
      "emotion": "ANGER|SADNESS|ANXIETY|JOY|LOVE|FEAR|HOPE|NEUTRAL",
      "intensity": 0.0-1.0,
      "confidence": 0.0-1.0
    }

    Guidelines:
    - ANGER: rage, fury, irritation, annoyance
    - SADNESS: grief, sorrow, depression, melancholy  
    - ANXIETY: worry, stress, nervousness, panic
    - JOY: happiness, excitement, delight, pleasure
    - LOVE: affection, romantic feelings, care, warmth
    - FEAR: terror, phobia, dread, apprehension
    - HOPE: optimism, faith, expectation, aspiration
    - NEUTRAL: calm, balanced, factual, mundane

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

export {
    analyzeEmotion,
    calculateFadeRate,
    calculateCurrentOpacity,
};