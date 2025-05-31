import {GoogleGenAI} from '@google/genai';

export const getGemini = () => {
    return new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!}); //gemini-2.0-flash
}