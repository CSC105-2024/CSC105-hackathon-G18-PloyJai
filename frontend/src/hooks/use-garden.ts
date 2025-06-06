import {apiClient} from "@/lib/api";
import type {GardenPlant} from "@/types";
import {useEffect, useState} from "react";
import {useCleanup} from "./use-cleanup";

export function useGarden() {
    const [plants, setPlants] = useState<GardenPlant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGarden = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.getGarden();
            setPlants(response.plants);
        } catch (err: any) {
            console.error('Error fetching garden:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch garden');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGarden();
    }, []);

    return {plants, loading, error, refetch: fetchGarden, setPlants};
}

export function useGardenWithCleanup() {
    const gardenResult = useGarden();
    const {runCleanup} = useCleanup();

    useEffect(() => {
        if (gardenResult.plants.length >= 0) {
            runCleanup().then((result) => {
                if (result.updatedEntries > 0) {
                    gardenResult.refetch();
                }
            }).catch(console.error);
        }
    }, [gardenResult.plants.length]);

    return gardenResult;
}