import {apiClient} from "@/lib/api";
import type {UserStats} from "@/types";
import {useEffect, useState} from "react";

export function useStats() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.getStats();
            setStats(response.stats);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {stats, loading, error, refetch: fetchStats};
}