import type {DiaryEntry} from "@/types";
import {useEffect, useState} from "react";
import {apiClient} from "@/lib/api.ts";

export function useEntries(filter?: 'all' | 'fading' | 'transformed') {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.getEntries(filter);
            setEntries(response.entries);
        } catch (err: any) {
            console.error('Error fetching entries:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch entries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [filter]);

    return {entries, loading, error, refetch: fetchEntries, setEntries};
}