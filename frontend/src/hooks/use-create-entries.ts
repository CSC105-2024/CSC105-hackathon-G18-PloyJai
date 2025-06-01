import {apiClient} from "@/lib/api";
import type {DiaryEntry, EmotionAnalysis} from "@/types";
import {useState} from "react";

export function useCreateEntry() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCreatedEntry, setLastCreatedEntry] = useState<DiaryEntry | null>(null);
    const [lastAnalysis, setLastAnalysis] = useState<EmotionAnalysis | null>(null);

    const createEntry = async (content: string, title?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.createEntry(content, title);
            setLastCreatedEntry(response.entry);
            setLastAnalysis(response.emotionAnalysis);
            return response;
        } catch (err: any) {
            console.error('Error creating entry:', err);
            setError(err.response?.data?.error || err.message || 'Failed to create entry');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setLastCreatedEntry(null);
        setLastAnalysis(null);
    };

    return {
        createEntry,
        loading,
        error,
        lastCreatedEntry,
        lastAnalysis,
        reset
    };
}