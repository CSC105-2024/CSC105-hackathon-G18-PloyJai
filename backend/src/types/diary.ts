interface EmotionAnalysis {
    emotion: 'ANGER' | 'SADNESS' | 'ANXIETY' | 'JOY' | 'LOVE' | 'FEAR' | 'HOPE' | 'NEUTRAL'
    intensity: number
    confidence: number
}

export {
    EmotionAnalysis
};