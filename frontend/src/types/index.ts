export interface DiaryEntry {
    id: string;
    content: string;
    title?: string;
    emotion: string;
    emotionScore: number;
    currentOpacity: number;
    isFullyFaded: boolean;
    createdAt: string;
    fadeStartDate: string;
    lastViewedAt?: string;
    viewCount: number;
    fadeRate: number;
    transformedAt?: string;
}

export interface GardenPlant {
    id: string;
    plantType: string;
    emotion: string;
    color: string;
    size: number;
    beauty: number;
    positionX: number;
    positionY: number;
    growthStage: number;
    transformedDate: string;
    diaryEntry?: {
        emotion: string;
        createdAt: string;
        emotionScore: number;
        transformedAt: string;
    };
}

export interface UserStats {
    totalEntries: number;
    totalPlants: number;
    fadingEntries: number;
    daysActive: number;
    gardenBeauty: number;
}

export interface Settings {
    angerFadeRate: number;
    sadnessFadeRate: number;
    anxietyFadeRate: number;
    joyFadeRate: number;
    fearFadeRate: number;
    loveFadeRate: number;
    hopeFadeRate: number;
    neutralFadeRate: number;
}

export interface EmotionAnalysis {
    emotion: 'ANGER' | 'SADNESS' | 'ANXIETY' | 'JOY' | 'LOVE' | 'FEAR' | 'HOPE' | 'NEUTRAL';
    intensity: number;
    confidence: number;
}