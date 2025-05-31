import React, {useState, useEffect} from 'react';
import {Flower, TreePine, Leaf, Sparkles, Heart, Star, RefreshCw, Calendar, Eye, Wand2} from 'lucide-react';
import DefaultLayout from "@/components/layout/default.tsx";
import type {GardenPlant} from '@/types';
import {useStats} from '@/hooks/use-stats.ts';
import {useCleanup} from '@/hooks/use-cleanup.ts';
import {useGardenWithCleanup} from '@/hooks/use-garden.ts';
import {toast} from 'sonner';


function Page() {
    const {plants, loading: plantsLoading, error: plantsError, refetch: refetchGarden} = useGardenWithCleanup();
    const {stats, loading: statsLoading, error: statsError, refetch: refetchStats} = useStats();
    const {runCleanup, loading: cleanupLoading} = useCleanup();
    const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);
    const [gardenStats, setGardenStats] = useState({
        totalPlants: 0,
        totalReleases: 0,
        gardenBeauty: 0
    });

    useEffect(() => {
        if (stats) {
            setGardenStats({
                totalPlants: stats.totalPlants,
                totalReleases: stats.totalEntries,
                gardenBeauty: stats.gardenBeauty
            });
        }
    }, [stats]);

    const handleRefresh = async () => {
        try {
            await runCleanup();
            await Promise.all([refetchGarden(), refetchStats()]);
        } catch (error) {
            console.error('Refresh failed:', error);
            await Promise.all([refetchGarden(), refetchStats()]);
        }
    };

    const handleManualTransform = async () => {
        try {
            const result = await runCleanup();

            await Promise.all([refetchGarden(), refetchStats()]);

            if (result.updatedEntries > 0) {
                toast.success(`Amazing! ${result.updatedEntries} new plants have grown in your garden!`);
            } else {
                toast.info('No entries are ready for transformation yet. Keep writing and letting go!');
            }
        } catch (err) {
            console.error('Manual transform failed:', err);
            toast.error('Transformation failed. Please try again.');
        }
    };


    const PlantIcon = ({plant}: { plant: GardenPlant }) => {
        const baseSize = 24 * plant.size;
        const opacity = Math.min(0.3 + (plant.growthStage * 0.15), 1);

        const iconProps = {
            size: baseSize,
            color: plant.color,
            style: {
                opacity,
                filter: `drop-shadow(0 2px 4px ${plant.color}40)`,
                transition: 'all 0.3s ease'
            }
        };

        switch (plant.type) {
            case 'FLOWER':
                return <Flower {...iconProps} />;
            case 'TREE':
                return <TreePine {...iconProps} />;
            case 'SUCCULENT':
                return <Leaf {...iconProps} />;
            case 'VINE':
                return <Heart {...iconProps} />;
            case 'MOSS':
                return <Sparkles {...iconProps} />;
            case 'CRYSTAL':
                return <Star {...iconProps} />;
            default:
                return <Flower {...iconProps} />;
        }
    };


    const getPlantTypeName = (type: string, emotion: string) => {
        const names = {
            FLOWER: emotion === 'JOY' ? '🌸 Flower of Happiness' : '🌺 Flower of Love',
            TREE: '🌳 Tree of Strength',
            SUCCULENT: '🌿 Plant of Resilience',
            VINE: '🌺 Vine of Connection',
            MOSS: '✨ Moss of Peace',
            CRYSTAL: emotion === 'HOPE' ? '💎 Crystal of Hope' : '🔮 Crystal of Clarity'
        };
        return names[type as keyof typeof names] || '🌱 Beautiful Plant';
    };


    const getEmotionName = (emotion: string) => {
        const emotions = {
            JOY: 'Joy',
            SADNESS: 'Sadness',
            ANXIETY: 'Anxiety',
            ANGER: 'Anger',
            LOVE: 'Love',
            FEAR: 'Fear',
            HOPE: 'Hope',
            NEUTRAL: 'Peace'
        };
        return emotions[emotion as keyof typeof emotions] || emotion;
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (plantsLoading || statsLoading) {
        return (
            <DefaultLayout>
                <div
                    className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div
                            className="w-16 h-16 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Growing your garden...</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (plantsError || statsError) {
        return (
            <DefaultLayout>
                <div
                    className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">🥀</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Garden</h3>
                        <p className="text-slate-600 mb-4">{plantsError || statsError}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-green-200">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-green-800 mb-2">
                                    Your Garden of Release
                                </h1>
                                <p className="text-green-600">
                                    Pain transforms into beauty • {plants.length} plants grown from healing
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleManualTransform}
                                    disabled={cleanupLoading}
                                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                                >
                                    <Wand2 size={16} className={cleanupLoading ? 'animate-spin' : ''}/>
                                    {cleanupLoading ? 'Growing...' : 'Grow Plants'}
                                </button>
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                    disabled={plantsLoading || statsLoading}
                                >
                                    <RefreshCw size={16}
                                               className={(plantsLoading || statsLoading) ? 'animate-spin' : ''}/>
                                    Refresh
                                </button>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">
                                        {gardenStats.totalPlants} plants
                                    </div>
                                    <div className="text-sm text-green-600">
                                        from {gardenStats.totalReleases} releases
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Garden Stats */}
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200 transform hover:scale-105 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    🌸
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-800">{gardenStats.totalPlants}</div>
                                    <div className="text-green-600">Plants Grown</div>
                                    <div className="text-xs text-green-500">From transformed pain</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 transform hover:scale-105 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    💙
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-800">{gardenStats.totalReleases}</div>
                                    <div className="text-blue-600">Memories Released</div>
                                    <div className="text-xs text-blue-500">Your healing journey</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 transform hover:scale-105 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    ✨
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-800">{gardenStats.gardenBeauty}%
                                    </div>
                                    <div className="text-purple-600">Garden Beauty</div>
                                    <div className="text-xs text-purple-500">Transformation rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Garden View */}
                <div className="max-w-6xl mx-auto px-4 pb-8">
                    {plants.length > 0 ? (
                        <div
                            className="bg-white/40 backdrop-blur-sm rounded-3xl border border-green-200 overflow-hidden">
                            <div
                                className="relative h-96 md:h-[500px] bg-gradient-to-b from-sky-100 via-green-50 to-green-100">
                                {/* Ground */}
                                <div
                                    className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-200 to-transparent"></div>

                                {/* Plants */}
                                {plants.map((plant) => (
                                    <div
                                        key={plant.id}
                                        className="absolute cursor-pointer transform hover:scale-110 transition-all duration-300 z-10"
                                        style={{
                                            left: `${plant.positionX}%`,
                                            top: `${plant.positionY}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        onClick={() => setSelectedPlant(plant)}
                                    >
                                        <div className="relative">
                                            <PlantIcon plant={plant}/>
                                            {/* Growth sparkles for mature plants */}
                                            {plant.growthStage >= 2 && (
                                                <div className="absolute -top-2 -right-2 animate-pulse">
                                                    <Sparkles size={12} color={plant.color}/>
                                                </div>
                                            )}
                                            {/* Beauty glow for high-beauty plants */}
                                            {plant.beauty > 0.8 && (
                                                <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                                                     style={{backgroundColor: plant.color}}></div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Floating particles for ambiance */}
                                <div className="absolute top-10 left-10 animate-bounce">
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full opacity-60"></div>
                                </div>
                                <div className="absolute top-20 right-20 animate-bounce delay-1000">
                                    <div className="w-1 h-1 bg-pink-300 rounded-full opacity-60"></div>
                                </div>
                                <div className="absolute top-32 left-1/3 animate-bounce delay-2000">
                                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full opacity-60"></div>
                                </div>
                                <div className="absolute bottom-20 right-1/4 animate-bounce delay-3000">
                                    <div className="w-1 h-1 bg-purple-300 rounded-full opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty Garden State */
                        <div
                            className="bg-white/40 backdrop-blur-sm rounded-3xl border border-green-200 p-16 text-center">
                            <div className="text-6xl mb-6">🌱</div>
                            <h3 className="text-2xl font-bold text-slate-600 mb-3">Your Garden is Waiting</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                Write diary entries and let them fade away to grow beautiful plants.
                                Each released emotion becomes something wonderful here.
                            </p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="/write"
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                >
                                    Write First Entry
                                </a>
                                <a
                                    href="/entries"
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    View My Entries
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Plant Detail Modal */}
                {selectedPlant && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-green-200 shadow-2xl">
                            <div className="text-center mb-6">
                                <div
                                    className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
                                    <PlantIcon plant={{...selectedPlant, size: 2}}/>
                                </div>
                                <h3 className="text-2xl font-bold text-green-800 mb-2">
                                    {getPlantTypeName(selectedPlant.type, selectedPlant.emotion)}
                                </h3>
                                {selectedPlant.diaryEntry && (
                                    <p className="text-green-600">
                                        Born from {getEmotionName(selectedPlant.diaryEntry.emotion)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                                    <span className="text-green-700">Growth Stage</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(stage => (
                                            <div
                                                key={stage}
                                                className={`w-3 h-3 rounded-full ${
                                                    stage <= selectedPlant.growthStage
                                                        ? 'bg-green-400'
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                    <span className="text-blue-700 flex items-center gap-2">
                                        <Calendar size={16}/>
                                        Transformed
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                        {selectedPlant.diaryEntry ? formatDate(selectedPlant.diaryEntry.transformedAt) : "Unknown Date"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                                    <span className="text-purple-700">Beauty Score</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-400 transition-all"
                                                style={{width: `${selectedPlant.beauty * 100}%`}}
                                            />
                                        </div>
                                        <span className="text-purple-600 font-medium">
                                            {Math.round(selectedPlant.beauty * 100)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Original entry info if available */}
                                {selectedPlant.diaryEntry && (
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                                        <span className="text-amber-700 flex items-center gap-2">
                                            <Eye size={16}/>
                                            Original Entry
                                        </span>
                                        <span className="text-amber-600 font-medium">
                                            {formatDate(selectedPlant.diaryEntry.createdAt)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedPlant(null)}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Inspirational Quote */}
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
                        <p className="text-xl text-green-800 mb-2 font-medium">
                            "Pain released becomes beauty grown"
                        </p>
                        <p className="text-green-600 font-medium">
                            Every plant here represents a moment of healing
                        </p>
                        {plants.length > 0 && (
                            <div className="mt-4 text-sm text-green-500">
                                Your garden
                                contains {plants.length} beautiful {plants.length === 1 ? 'plant' : 'plants'}
                                {gardenStats.gardenBeauty > 0 && ` with ${gardenStats.gardenBeauty}% transformation rate`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Page;
