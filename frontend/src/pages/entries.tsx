import React, {useState} from 'react';
import {
    Clock,
    Eye,
    Calendar,
    Droplets,
    Flame,
    Zap,
    Sun,
    Heart,
    Sparkles,
    Star,
    EyeOff,
    Timer,
    Leaf,
    RefreshCw
} from 'lucide-react';
import DefaultLayout from "@/components/layout/default.tsx";
import { apiClient } from '@/lib/api';
import type {DiaryEntry} from '@/types'
import {useEntries} from '@/hooks/use-entries.ts'
import {useCleanup} from "@/hooks/use-cleanup.ts";

function Page() {
    const [filter, setFilter] = useState<'all' | 'fading' | 'transformed'>('all');
    const { entries, loading, error, refetch, setEntries } = useEntries(filter);
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
    const { runCleanup, loading: cleanupLoading } = useCleanup();
    const [showWarning, setShowWarning] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const emotions = {
        ANGER: {
            name: 'Anger',
            icon: Flame,
            color: '#EF4444',
            bgGradient: 'from-red-100 to-orange-100',
            description: 'Burns away quickly'
        },
        SADNESS: {
            name: 'Sadness',
            icon: Droplets,
            color: '#3B82F6',
            bgGradient: 'from-blue-100 to-cyan-100',
            description: 'Dissolves like tears'
        },
        ANXIETY: {
            name: 'Anxiety',
            icon: Zap,
            color: '#F59E0B',
            bgGradient: 'from-yellow-100 to-orange-100',
            description: 'Static that clears'
        },
        JOY: {
            name: 'Joy',
            icon: Sun,
            color: '#EAB308',
            bgGradient: 'from-yellow-100 to-amber-100',
            description: 'Golden sparkles that linger'
        },
        LOVE: {
            name: 'Love',
            icon: Heart,
            color: '#EC4899',
            bgGradient: 'from-pink-100 to-rose-100',
            description: 'Warm and enduring'
        },
        FEAR: {
            name: 'Fear',
            icon: Sparkles,
            color: '#8B5CF6',
            bgGradient: 'from-purple-100 to-violet-100',
            description: 'Trembles then fades'
        },
        HOPE: {
            name: 'Hope',
            icon: Star,
            color: '#06B6D4',
            bgGradient: 'from-cyan-100 to-sky-100',
            description: 'Shines bright and long'
        },
        NEUTRAL: {
            name: 'Peaceful',
            icon: Leaf,
            color: '#10B981',
            bgGradient: 'from-green-100 to-emerald-100',
            description: 'Natural transformation'
        }
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffDays > 0) return `${diffDays} days ago`;
        if (diffHours > 0) return `${diffHours} hours ago`;
        if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
        return 'Just now';
    };

    const getFadeProgress = (entry: DiaryEntry) => {
        if (entry.isFullyFaded) return 100;
        return Math.round((1 - entry.currentOpacity) * 100);
    };

    const getFadeTimeRemaining = (entry: DiaryEntry) => {
        if (entry.isFullyFaded) return 'Transformed';

        const fadeRate = entry.fadeRate;
        const baseDays = 7;
        const adjustedDays = Math.ceil(baseDays / fadeRate);
        const daysPassed = Math.floor((new Date().getTime() - new Date(entry.fadeStartDate).getTime()) / (1000 * 60 * 60 * 24));
        const remainingDays = Math.max(0, adjustedDays - daysPassed);

        if (entry.currentOpacity <= 0.1) return 'Transforming...';
        if (remainingDays === 0) return 'Will transform soon';
        return `${remainingDays} days until transformation`;
    };

    const getOpacityColor = (opacity: number) => {
        if (opacity > 0.7) return 'text-green-600';
        if (opacity > 0.4) return 'text-yellow-600';
        if (opacity > 0.1) return 'text-orange-600';
        return 'text-red-600';
    };

    const filteredEntries = entries.filter(entry => {
        if (filter === 'fading') return !entry.isFullyFaded;
        if (filter === 'transformed') return entry.isFullyFaded;
        return true;
    });

    const handleEntryView = async (entry: DiaryEntry) => {
        if (entry.isFullyFaded) return;

        // Show warning for entries that are very faded
        if (entry.currentOpacity <= 0.3) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
        }

        try {
            setActionLoading(entry.id);
            // Call backend to view entry (this will increment view count and update opacity)
            const response = await apiClient.getEntry(entry.id);

            // Update the entries list with the new data
            setEntries(prev => prev.map(e =>
                e.id === entry.id ? response.entry : e
            ));

            await runCleanup();
            setSelectedEntry(response.entry);
        } catch (err) {
            console.error('Failed to view entry:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAccelerateFade = async (entryId: string) => {
        try {
            setActionLoading(entryId);
            const response = await apiClient.accelerateFade(entryId);

            // Update the entries list
            setEntries(prev => prev.map(e =>
                e.id === entryId ? response.entry : e
            ));

            await runCleanup();
            setSelectedEntry(null);
        } catch (err) {
            console.error('Failed to accelerate fade:', err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading your release journey...</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (error) {
        return (
            <DefaultLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">❌</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Entries</h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    Your Release Journey
                                </h1>
                                <p className="text-slate-600">
                                    Watch your emotions slowly transform into beauty
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={async () => {
                                        await refetch();
                                        await runCleanup();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                    disabled={loading || cleanupLoading}
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-indigo-700">
                                        {entries.filter(e => !e.isFullyFaded).length}
                                    </div>
                                    <div className="text-sm text-slate-600">entries releasing</div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                {key: 'all', label: 'All Entries', icon: Calendar, count: entries.length},
                                {
                                    key: 'fading',
                                    label: 'Fading',
                                    icon: Timer,
                                    count: entries.filter(e => !e.isFullyFaded).length
                                },
                                {
                                    key: 'transformed',
                                    label: 'Transformed',
                                    icon: Leaf,
                                    count: entries.filter(e => e.isFullyFaded).length
                                }
                            ].map(tab => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(tab.key as 'all' | 'fading' | 'transformed')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            filter === tab.key
                                                ? 'bg-indigo-500 text-white shadow-lg scale-105'
                                                : 'bg-white/70 text-slate-600 hover:bg-white/90 hover:shadow-md'
                                        }`}
                                    >
                                        <TabIcon size={16}/>
                                        {tab.label} ({tab.count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Warning Toast */}
                {showWarning && (
                    <div
                        className="fixed top-20 right-4 z-50 bg-amber-100 border border-amber-300 rounded-2xl p-4 shadow-lg animate-pulse">
                        <div className="flex items-center gap-3">
                            <EyeOff size={20} className="text-amber-600"/>
                            <div className="text-amber-800">
                                <div className="font-medium">Viewing again accelerates fading</div>
                                <div className="text-xs">The more you look at pain, the faster it releases</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Entries List */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="space-y-6">
                        {filteredEntries.map((entry) => {
                            const emotion = emotions[entry.emotion] || emotions.NEUTRAL;
                            const EmotionIcon = emotion.icon;
                            const fadeProgress = getFadeProgress(entry);
                            const isLoading = actionLoading === entry.id;

                            return (
                                <div
                                    key={entry.id}
                                    className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                                        entry.isFullyFaded
                                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 cursor-default'
                                            : `bg-gradient-to-r ${emotion.bgGradient} border-slate-200 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-slate-300`
                                    } ${isLoading ? 'opacity-50' : ''}`}
                                    onClick={() => !isLoading && handleEntryView(entry)}
                                >
                                    {/* Fade Progress Bar */}
                                    {!entry.isFullyFaded && (
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000"
                                                style={{width: `${fadeProgress}%`}}
                                            />
                                        </div>
                                    )}

                                    {/* Loading Overlay */}
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                                            <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                                                        entry.isFullyFaded ? 'bg-emerald-100' : 'bg-white/80'
                                                    }`}>
                                                    {entry.isFullyFaded ? (
                                                        <Leaf size={24} className="text-emerald-600"/>
                                                    ) : (
                                                        <EmotionIcon size={24} style={{color: emotion.color}}/>
                                                    )}
                                                    {!entry.isFullyFaded && (
                                                        <div
                                                            className="absolute inset-0 rounded-full border-4 border-transparent"
                                                            style={{
                                                                borderTopColor: emotion.color,
                                                                opacity: entry.currentOpacity,
                                                                transform: `rotate(${(1 - entry.currentOpacity) * 360}deg)`,
                                                                transition: 'all 0.5s ease'
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold text-slate-800">
                                                        {emotion.name}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14}/>
                                                            {getTimeAgo(entry.createdAt)}
                                                        </div>
                                                        {entry.lastViewedAt && (
                                                            <div className="flex items-center gap-1">
                                                                <Eye size={14}/>
                                                                Viewed {entry.viewCount} times
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-1">
                                                {entry.isFullyFaded ? (
                                                    <div className="text-emerald-700 font-medium text-sm">
                                                        🌱 Transformed into plant
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div
                                                            className={`text-sm font-medium ${getOpacityColor(entry.currentOpacity)}`}>
                                                            {Math.round(entry.currentOpacity * 100)}% visible
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {getFadeTimeRemaining(entry)}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Preview */}
                                        <div
                                            className={`text-slate-700 leading-relaxed mb-4 text-base ${
                                                entry.isFullyFaded ? 'italic text-center' : ''
                                            }`}
                                            style={{
                                                opacity: entry.isFullyFaded ? 0.6 : Math.max(0.3, entry.currentOpacity),
                                                filter: entry.isFullyFaded ? 'blur(1px)' :
                                                    entry.currentOpacity < 0.3 ? 'blur(0.5px)' : 'none',
                                                transition: 'all 0.5s ease'
                                            }}
                                        >
                                            {entry.isFullyFaded ? (
                                                <div className="py-6 text-emerald-600">
                                                    ✨ This memory has transformed into something beautiful in your
                                                    garden
                                                    <div className="text-sm mt-2 text-emerald-500">
                                                        Transformed: {entry.transformedAt ? getTimeAgo(entry.transformedAt) : 'Recently'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {entry.title && (
                                                        <div className="font-semibold text-slate-800 mb-2">
                                                            {entry.title}
                                                        </div>
                                                    )}
                                                    {entry.content.length > 200
                                                        ? entry.content.substring(0, 200) + '...'
                                                        : entry.content}
                                                </>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-slate-500">
                                                {emotion.description}
                                            </div>

                                            {!entry.isFullyFaded && (
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-slate-400"/>
                                                    <span className="text-slate-500">
                                                        Fade rate: {entry.fadeRate}x
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredEntries.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-6">
                                {filter === 'fading' ? '⏳' : filter === 'transformed' ? '🌱' : '📝'}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-600 mb-3">
                                {filter === 'fading' ? 'No entries are fading' :
                                    filter === 'transformed' ? 'No plants have grown yet' :
                                        'No entries yet'}
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                {filter === 'all' ? 'Write your first entry to begin your journey of release' :
                                    'Wait a moment, feelings will slowly transform into beauty'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Entry Detail Modal */}
                {selectedEntry && !selectedEntry.isFullyFaded && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
                            {/* Modal Header */}
                            <div
                                className={`bg-gradient-to-r ${emotions[selectedEntry.emotion]?.bgGradient || 'from-gray-100 to-gray-200'} p-6 border-b border-slate-200`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                                            {React.createElement(emotions[selectedEntry.emotion]?.icon || Sparkles, {
                                                size: 24,
                                                style: {color: emotions[selectedEntry.emotion]?.color || '#10B981'}
                                            })}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">
                                                {emotions[selectedEntry.emotion]?.name || 'Unknown Emotion'}
                                            </h3>
                                            <p className="text-slate-600">
                                                {getTimeAgo(selectedEntry.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEntry(null)}
                                        className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-96">
                                {selectedEntry.title && (
                                    <h4 className="text-xl font-bold text-slate-800 mb-4">
                                        {selectedEntry.title}
                                    </h4>
                                )}

                                <div
                                    className="text-slate-800 leading-relaxed text-lg mb-6 p-6 bg-slate-50 rounded-2xl"
                                    style={{opacity: selectedEntry.currentOpacity}}
                                >
                                    {selectedEntry.content}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <div className="text-blue-800 font-semibold">Visibility</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.round(selectedEntry.currentOpacity * 100)}%
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl">
                                        <div className="text-amber-800 font-semibold">Times Viewed</div>
                                        <div className="text-2xl font-bold text-amber-600">
                                            {selectedEntry.viewCount}
                                        </div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                    <div className="flex items-center gap-3 text-red-800 mb-2">
                                        <EyeOff size={18}/>
                                        <span className="font-medium">Viewing again accelerates release</span>
                                    </div>
                                    <p className="text-red-700 text-sm">
                                        The more you revisit painful memories, the faster they fade away.
                                        This helps you let go more easily.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="p-6 border-t border-slate-200 bg-slate-50">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedEntry(null)}
                                        className="flex-1 py-3 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleAccelerateFade(selectedEntry.id)}
                                        disabled={actionLoading === selectedEntry.id}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === selectedEntry.id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Releasing...
                                            </>
                                        ) : (
                                            <>
                                                Release Now 🕊️
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Page;