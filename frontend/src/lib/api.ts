import type {DiaryEntry, EmotionAnalysis, GardenPlant, Settings, UserStats} from "@/types";
import axiosInstance from "./axios";

class ApiClient {

    async createEntry(content: string, title?: string): Promise<{
        entry: DiaryEntry;
        emotionAnalysis: EmotionAnalysis;
        message: string
    }> {
        const response = await axiosInstance.post('/entries', {content, title});
        return response.data.entry;
    }

    async getEntries(filter?: 'all' | 'fading' | 'transformed'): Promise<{ entries: DiaryEntry[] }> {
        const params = filter ? {filter} : {};
        const response = await axiosInstance.get('/entries', {params});
        return response.data;
    }

    async getEntry(id: string): Promise<{ entry: DiaryEntry }> {
        const response = await axiosInstance.get(`/entries/${id}`);
        return response.data;
    }

    async accelerateFade(id: string): Promise<{ entry: DiaryEntry; message: string }> {
        const response = await axiosInstance.put(`/entries/${id}/accelerate-fade`);
        return response.data;
    }

    async getGarden(): Promise<{ plants: GardenPlant[] }> {
        const response = await axiosInstance.get('/garden');
        return response.data;
    }

    async getSettings(): Promise<{ settings: Settings }> {
        const response = await axiosInstance.get('/settings');
        return response.data;
    }

    async updateSettings(settings: Partial<Settings>): Promise<{ settings: Settings; message: string }> {
        const response = await axiosInstance.put('/settings', settings);
        return response.data;
    }

    async getStats(): Promise<{ stats: UserStats }> {
        const response = await axiosInstance.get('/stats');
        return response.data;
    }

    async runCleanup(): Promise<{ message: string; updatedEntries: number }> {
        const response = await axiosInstance.post('/cleanup');
        return response.data;
    }
}

export const apiClient = new ApiClient();