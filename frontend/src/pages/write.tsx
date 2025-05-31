import React, {useEffect, useState} from 'react';
import {Cloud, Droplets, Heart, Send, Sparkles, Star, Sun, Zap} from 'lucide-react';
import DefaultLayout from "@/components/layout/default.tsx";
import {useCreateEntry} from '@/hooks/use-create-entries';

function Page() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        createEntry,
        loading: isWriting,
        error,
        lastCreatedEntry,
        lastAnalysis,
        reset
    } = useCreateEntry();


    const emotions = {
        JOY: {name: 'Joy', icon: Sun, color: '#FFD700', bgColor: 'bg-yellow-100'},
        SADNESS: {name: 'Sadness', icon: Droplets, color: '#87CEEB', bgColor: 'bg-blue-100'},
        ANXIETY: {name: 'Anxiety', icon: Zap, color: '#FFB347', bgColor: 'bg-orange-100'},
        ANGER: {name: 'Anger', icon: Cloud, color: '#FF6B6B', bgColor: 'bg-red-100'},
        LOVE: {name: 'Love', icon: Heart, color: '#FFB6C1', bgColor: 'bg-pink-100'},
        FEAR: {name: 'Fear', icon: Sparkles, color: '#8B5CF6', bgColor: 'bg-purple-100'},
        HOPE: {name: 'Hope', icon: Star, color: '#06B6D4', bgColor: 'bg-cyan-100'},
        NEUTRAL: {name: 'Peaceful', icon: Sparkles, color: '#98FB98', bgColor: 'bg-green-100'}
    };

    useEffect(() => {
        setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
    }, [content]);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            await createEntry(content, title || undefined);
            setShowSuccess(true);


            setTimeout(() => {
                setContent('');
                setTitle('');
                setShowSuccess(false);
                reset();
            }, 10000);

        } catch (err) {
            console.error('Failed to create entry:', err);
        }
    };

    const emotion = lastAnalysis?.emotion;
    const EmotionIcon = emotion ? emotions[emotion]?.icon : Sparkles;
    const emotionColor = emotion ? emotions[emotion]?.color : '#98FB98';
    const emotionBg = emotion ? emotions[emotion]?.bgColor : 'bg-green-100';

    const getFadeTimeFromEmotion = (emotionType: string) => {
        const fadeRates = {
            ANGER: 2.0,
            ANXIETY: 1.8,
            SADNESS: 1.5,
            NEUTRAL: 1.0,
            FEAR: 1.7,
            HOPE: 0.4,
            LOVE: 0.2,
            JOY: 0.3
        };

        const rate = fadeRates[emotionType as keyof typeof fadeRates] || 1.0;
        const baseDays = 7;
        const days = Math.ceil(baseDays / rate);

        if (days <= 3) return '2-3 days';
        if (days <= 5) return '3-5 days';
        if (days <= 7) return '1 week';
        if (days <= 14) return '1-2 weeks';
        return '2-4 weeks';
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-purple-800 mb-2">
                                Write to Release
                            </h1>
                            <p className="text-purple-600">
                                Let your feelings flow through words, then watch them transform into beauty
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="text-red-600">❌</div>
                                <span className="text-red-800 font-medium">Error: {error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {showSuccess && (
                        <div
                            className="mb-6 p-6 bg-green-100 border border-green-300 rounded-2xl text-center animate-fade-in">
                            <div className="text-4xl mb-2">🌱</div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">
                                Successfully Released!
                            </h3>
                            <p className="text-green-600 mb-2">
                                Your feelings are beginning their transformation into something beautiful
                            </p>
                            {emotion && lastAnalysis && (
                                <div className="text-sm text-green-700 bg-green-50 rounded-lg p-3 mt-3">
                                    <strong>AI Analysis:</strong> {emotions[emotion!]?.name} detected
                                    with {Math.round(lastAnalysis.intensity * 100)}% intensity
                                    (Confidence: {Math.round(lastAnalysis.confidence * 100)}%)
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title Input (Optional) */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Entry title (optional)..."
                            className="w-full p-4 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            disabled={isWriting}
                        />
                    </div>

                    {/* Writing Area */}
                    <div
                        className="bg-white/60 backdrop-blur-sm rounded-3xl border border-purple-200 overflow-hidden mb-6 shadow-lg">
                        <div className="p-6 border-b border-purple-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 ${emotionBg} rounded-full flex items-center justify-center transition-all duration-500`}>
                                        <EmotionIcon size={24} color={emotionColor}/>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {emotion ? emotions[emotion].name : 'AI will analyze your emotion'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {wordCount} words
                                        </div>
                                    </div>
                                </div>

                                {isWriting && (
                                    <div className="flex items-center gap-2 text-purple-600">
                                        <div
                                            className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                        <span className="text-sm">Analyzing with AI...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write what you want to release... Don't worry, these words will slowly fade away over time and transform into something beautiful in your garden. Let your emotions flow freely."
                                className="w-full h-64 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400 leading-relaxed"
                                disabled={isWriting}
                            />
                        </div>
                    </div>

                    {/* AI Emotion Analysis Preview */}
                    {emotion && lastAnalysis && (
                        <div
                            className="mb-6 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <EmotionIcon size={20} color={emotionColor}/>
                                    <span className="text-gray-700">
                                        {emotions[emotion].name} will gradually fade in
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800">
                                        {getFadeTimeFromEmotion(emotion)}
                                    </div>
                                    <div className="text-sm text-gray-600">then become a garden plant</div>
                                </div>
                            </div>

                            {/* AI Analysis Details */}
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-blue-800 text-sm">
                                    <strong>AI
                                        Analysis:</strong> Detected {emotions[emotion].name} with {Math.round(lastAnalysis.intensity * 100)}%
                                    intensity
                                    (Confidence: {Math.round(lastAnalysis.confidence * 100)}%)
                                </p>
                                <p className="text-blue-700 text-xs mt-1">
                                    💡 <strong>The Paradox:</strong> {' '}
                                    {emotion === 'ANGER' ? 'Anger burns away quickly to reduce your pain' :
                                        emotion === 'ANXIETY' ? 'Anxiety dissolves fast to bring you peace' :
                                            emotion === 'SADNESS' ? 'Sadness flows away like tears to heal your heart' :
                                                emotion === 'LOVE' ? 'Love lingers longest to preserve the warmth' :
                                                    emotion === 'JOY' ? 'Joy stays bright to keep your happy memories alive' :
                                                        emotion === 'FEAR' ? 'Fear dissolves quickly to restore your courage' :
                                                            emotion === 'HOPE' ? 'Hope shines long to guide your path forward' :
                                                                'Peaceful thoughts transform naturally at their own pace'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isWriting}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                        >
                            {isWriting ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing & Releasing...
                                </>
                            ) : (
                                <>
                                    <Send size={20}/>
                                    Release & Transform
                                </>
                            )}
                        </button>
                    </div>

                    {/* Helper Tips */}
                    <div className="mt-8 text-center">
                        <div
                            className="inline-block p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200 max-w-2xl">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">
                                💡 Tips for Therapeutic Writing
                            </h3>
                            <div className="text-gray-600 text-sm space-y-2 text-left">
                                <p>• <strong>Write freely:</strong> Don't think too much, just let it flow</p>
                                <p>• <strong>No judgment:</strong> Grammar and spelling don't matter here</p>
                                <p>• <strong>Be honest:</strong> Express your true emotions without filters</p>
                                <p>• <strong>Trust the AI:</strong> Our Gemini AI will understand your emotions</p>
                                <p>• <strong>The paradox:</strong> The more painful the memory, the faster it transforms
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Emotion Guide */}
                    <div className="mt-8">
                        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-center">
                                🎨 How Emotions Transform
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(emotions).map(([key, emotion]) => {
                                    const Icon = emotion.icon;
                                    return (
                                        <div key={key} className="flex items-center gap-2 p-3 rounded-xl bg-white/50">
                                            <Icon size={16} color={emotion.color}/>
                                            <div>
                                                <div className="font-medium text-gray-800 text-xs">{emotion.name}</div>
                                                <div className="text-xs text-gray-600">
                                                    {key === 'ANGER' ? 'Burns → Crystals' :
                                                        key === 'SADNESS' ? 'Flows → Trees' :
                                                            key === 'ANXIETY' ? 'Dissolves → Succulents' :
                                                                key === 'JOY' ? 'Sparkles → Flowers' :
                                                                    key === 'LOVE' ? 'Glows → Roses' :
                                                                        key === 'FEAR' ? 'Trembles → Moss' :
                                                                            key === 'HOPE' ? 'Shines → Stars' :
                                                                                'Drifts → Moss'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Page;