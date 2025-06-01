import {apiClient} from "@/lib/api";
import type {Settings} from "@/types";
import {useEffect, useState} from "react";

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.getSettings();
            setSettings(response.settings);
        } catch (err: any) {
            console.error('Error fetching settings:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            setError(null);
            const response = await apiClient.updateSettings(newSettings);
            setSettings(response.settings);
            return response;
        } catch (err: any) {
            console.error('Error updating settings:', err);
            setError(err.response?.data?.error || err.message || 'Failed to update settings');
            throw err;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {settings, loading, error, updateSettings, refetch: fetchSettings};
}
