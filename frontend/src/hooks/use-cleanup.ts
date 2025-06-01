import {apiClient} from "@/lib/api";
import {useEffect, useState} from "react";
import {useEntries} from "./use-entries";

export function useCleanup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCleanup, setLastCleanup] = useState<{
        message: string;
        updatedEntries: number;
    } | null>(null);

    const runCleanup = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.runCleanup();
            setLastCleanup(response);
            return response;
        } catch (err: any) {
            console.error('Cleanup failed:', err);
            setError(err.response?.data?.error || err.message || 'Cleanup failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {runCleanup, loading, error, lastCleanup};
}

// Enhanced entries hook with auto-cleanup
export function useEntriesWithCleanup(filter?: 'all' | 'fading' | 'transformed') {
    const entriesResult = useEntries(filter);
    const {runCleanup} = useCleanup();

    // Auto cleanup when entries are loaded
    useEffect(() => {
        if (entriesResult.entries.length > 0) {
            // Check if any entries might need cleanup
            const needsCleanup = entriesResult.entries.some(entry =>
                !entry.isFullyFaded && entry.currentOpacity <= 0.1
            );

            if (needsCleanup) {
                runCleanup().then(() => {
                    // Refetch entries after cleanup
                    entriesResult.refetch();
                }).catch(console.error);
            }
        }
    }, [entriesResult.entries.length, runCleanup, entriesResult.refetch]);

    return entriesResult;
}