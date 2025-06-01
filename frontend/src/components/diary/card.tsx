import React, {type ForwardRefExoticComponent, type RefAttributes} from 'react';
import type {DiaryEntry, EmotionAnalysis} from "@/types";
import type {LucideProps} from "lucide-react";

interface EmotionCard {
    entry: DiaryEntry;
    emotion: {
        name: string,
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
        color: string,
        bgGradient: string,
        description: string,
    };
    onCardClick: () => void;
    isLoading: boolean;
    children: React.ReactNode | React.ReactNode[];
    fadeProgress: number;
}

// ANGER - Fire Burning Card
const AngerCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 20;
    const effectIntensity = Math.min(fadeProgress / 100, 1.8);

    const generateEmbers = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`ember-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: Math.random() * 4 + 2 + 'px',
                    height: Math.random() * 4 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 60 + 20 + '%',
                    background: 'radial-gradient(circle, #ff4500 0%, #ff6b35 50%, transparent 70%)',
                    opacity: effectIntensity * 0.8,
                    animation: `ember ${2 + Math.random() * 3}s ease-out infinite`,
                    animationDelay: Math.random() * 2 + 's',
                    boxShadow: '0 0 6px rgba(255, 69, 0, 0.9)'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
        >
            {children}

            {shouldShowEffect && (
                <>

                    <div className="absolute inset-0 pointer-events-none">
                        {generateEmbers(6)}
                    </div>

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `inset 0 0 30px rgba(255, 69, 0, ${effectIntensity * 0.6}), 0 0 20px rgba(255, 69, 0, ${effectIntensity * 0.4})`,
                            borderRadius: 'inherit'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            background: `radial-gradient(circle at 50% 100%, rgba(255, 69, 0, ${effectIntensity * 0.15}) 0%, transparent 60%)`,
                            animation: 'fireFlicker 1.5s ease-in-out infinite'
                        }}
                    />
                </>
            )}
        </div>
    );
};

// SADNESS - Water Dissolving Card
const SadnessCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 25;
    const effectIntensity = Math.min(fadeProgress / 100, 0.7);

    const generateWaterDroplets = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`water-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: Math.random() * 8 + 1 + 'px',
                    height: Math.random() * 8 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 30 + '%',
                    background: 'rgba(59, 130, 246, 0.4)',
                    opacity: effectIntensity * 0.6,
                    animation: `waterDrop ${3 + Math.random() * 2}s linear infinite`,
                    animationDelay: Math.random() * 3 + 's'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none">
                        {generateWaterDroplets(6)}
                    </div>

                    <div
                        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none rounded-b-3xl"
                        style={{
                            background: `linear-gradient(to top, rgba(59, 130, 246, ${effectIntensity * 0.15}), transparent)`
                        }}
                    />
                </>
            )}
        </div>
    );
};

// ANXIETY - Static Clearing Card
const AnxietyCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 15;
    const effectIntensity = Math.min(fadeProgress / 100, 0.9);

    const generateStaticBlocks = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`static-block-${i}`}
                className="absolute pointer-events-none"
                style={{
                    width: Math.random() * 40 + 20 + 'px',
                    height: Math.random() * 8 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    background: `repeating-linear-gradient(90deg, rgba(255, 255, 255, ${effectIntensity * 0.8}) 0px, rgba(0, 0, 0, ${effectIntensity * 0.6}) 1px, rgba(255, 255, 255, ${effectIntensity * 0.7}) 2px, rgba(128, 128, 128, ${effectIntensity * 0.5}) 3px)`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `staticBlock ${Math.random() * 0.8 + 0.1}s infinite`,
                    mixBlendMode: 'overlay'
                }}
            />
        ));
    };

    const generateDigitalNoise = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`noise-${i}`}
                className="absolute pointer-events-none"
                style={{
                    width: '100%',
                    height: Math.random() * 0.15 + 1 + 'px',
                    left: '0%',
                    top: Math.random() * 100 + '%',
                    background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, ${effectIntensity * 0.9}) 20%, rgba(0, 0, 0, ${effectIntensity * 0.7}) 40%, rgba(255, 255, 255, ${effectIntensity * 0.8}) 60%, transparent 100%)`,
                    opacity: Math.random() * 0.2 + 0.1,
                    animation: `staticScan ${Math.random() * 0.3 + 1.2}s infinite`,
                    mixBlendMode: 'difference'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
            style={{
                filter: shouldShowEffect ? `contrast(${1 + effectIntensity * 0.3}) brightness(${1 + effectIntensity * 0.2})` : 'none'
            }}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div className="absolute inset-0 pointer-events-none">
                        {generateStaticBlocks(6)}
                    </div>

                    <div className="absolute inset-0 pointer-events-none">
                        {generateDigitalNoise(4)}
                    </div>

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            background: `repeating-linear-gradient(0deg, transparent 0px, rgba(255, 255, 255, ${effectIntensity * 0.1}) 1px, transparent 2px, rgba(0, 0, 0, ${effectIntensity * 0.05}) 3px)`,
                            animation: 'screenFlicker 0.1s infinite',
                            mixBlendMode: 'overlay'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `inset 0 0 20px rgba(255, 255, 0, ${effectIntensity * 0.3}), 0 0 10px rgba(255, 255, 255, ${effectIntensity * 0.2})`,
                            border: `1px solid rgba(255, 255, 255, ${effectIntensity * 0.4})`,
                            borderRadius: 'inherit'
                        }}
                    />
                </>
            )}
        </div>
    );
};

// JOY - Golden Sparkles Card
const JoyCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 70;
    const effectIntensity = Math.min((100 - fadeProgress) / 100, 0.8) + 3;
    
    const generateSparkles = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`sparkle-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: Math.random() * 10 + 1 + 'px',
                    height: Math.random() * 10 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)',
                    boxShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
                    opacity: effectIntensity * 0.7,
                    animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: Math.random() * 2 + 's'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div className="absolute inset-0 pointer-events-none p-4">
                        {generateSparkles(8)}
                    </div>

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `0 0 20px rgba(255, 215, 0, ${effectIntensity * 0.2})`
                        }}
                    />
                </>
            )}
        </div>
    );
};

// LOVE - Warm and Enduring Card
const LoveCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 15;
    const effectIntensity = Math.min((100 - fadeProgress) / 100 + 0.3, 1.0);

    const generateHeartParticles = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`heart-${i}`}
                className="absolute pointer-events-none"
                style={{
                    width: Math.random() * 18 + 3 + 'px',
                    height: Math.random() * 18 + 3 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    background: `radial-gradient(circle, rgba(255, ${150 + Math.random() * 105}, ${80 + Math.random() * 120}, 0.8) 0%, rgba(255, ${180 + Math.random() * 75}, ${100 + Math.random() * 100}, 0.4) 40%, transparent 70%)`,
                    borderRadius: '50%',
                    opacity: effectIntensity * 0.8,
                    animation: `heartFloat ${6 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: Math.random() * 4 + 's',
                    boxShadow: `0 0 80px rgba(255, 176, 100, ${effectIntensity * 0.6})`
                }}
            />
        ));
    };

    const generateWarmWaves = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`wave-${i}`}
                className="absolute pointer-events-none"
                style={{
                    width: '120%',
                    height: Math.random() * 20 + 20 + 'px',
                    left: '-10%',
                    top: Math.random() * 104 + '%',
                    background: `linear-gradient(90deg, transparent 0%, rgba(255, ${170 + Math.random() * 85}, ${90 + Math.random() * 110}, ${effectIntensity * 0.3}) 25%, rgba(255, ${190 + Math.random() * 65}, ${110 + Math.random() * 90}, ${effectIntensity * 0.4}) 50%, rgba(255, ${160 + Math.random() * 95}, ${70 + Math.random() * 130}, ${effectIntensity * 0.3}) 75%, transparent 100%)`,
                    borderRadius: '50%',
                    opacity: effectIntensity * 0.1,
                    animation: `warmWave ${8 + Math.random() * 6}s ease-in-out infinite`,
                    animationDelay: Math.random() * 3 + 's',
                    filter: 'blur(2px)'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                        {generateWarmWaves(8)}
                    </div>

                    <div className="absolute inset-0 pointer-events-none p-4">
                        {generateHeartParticles(8)}
                    </div>

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `0 0 40px rgba(255, 176, 100, ${effectIntensity * 0.5}), inset 0 0 30px rgba(255, 200, 120, ${effectIntensity * 0.2})`,
                            borderRadius: 'inherit'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            background: `radial-gradient(ellipse at center, rgba(255, 176, 100, ${effectIntensity * 0.15}) 0%, rgba(255, 200, 120, ${effectIntensity * 0.1}) 40%, transparent 70%)`,
                            animation: 'warmPulse 4s ease-in-out infinite'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            border: `2px solid rgba(255, 176, 100, ${effectIntensity * 0.4})`,
                            borderRadius: 'inherit',
                            animation: 'borderGlow 6s ease-in-out infinite'
                        }}
                    />
                </>
            )}
        </div>
    );
};

// FEAR - Trembles then Fades Card
const FearCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress > 40;
    const effectIntensity = Math.min(fadeProgress / 100, 0.8);

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
            style={{
                animation: shouldShowEffect ? `trembleEffect ${2 - effectIntensity}s ease-in-out infinite` : 'none'
            }}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            background: `rgba(0, 0, 0, ${effectIntensity * 0.1})`,
                            mixBlendMode: 'multiply'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `inset 0 0 20px rgba(0, 0, 0, ${effectIntensity * 0.2})`
                        }}
                    />
                </>
            )}
        </div>
    );
};

// HOPE - Shines Bright and Long Card
const HopeCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const shouldShowEffect = fadeProgress < 95;
    const effectIntensity = Math.min((100 - fadeProgress) / 100 + 0.4, 1.0);

    const generateLightBeams = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`beam-${i}`}
                className="absolute pointer-events-none"
                style={{
                    width: '4px',
                    height: Math.random() * 80 + 40 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    background: `linear-gradient(0deg, transparent, rgba(255, 255, ${200 + Math.random() * 55}, 0.9), rgba(255, 255, 255, 1), rgba(255, 255, ${200 + Math.random() * 55}, 0.9), transparent)`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    transformOrigin: 'center center',
                    opacity: effectIntensity * 0.8,
                    animation: `lightBeam ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: Math.random() * 2 + 's',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                }}
            />
        ));
    };

    const generateBrilliantParticles = (count: number) => {
        if (!shouldShowEffect) return null;

        return Array.from({length: Math.floor(count * effectIntensity)}, (_, i) => (
            <div
                key={`brilliant-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: Math.random() * 8 + 3 + 'px',
                    height: Math.random() * 8 + 3 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    background: `radial-gradient(circle, rgba(255, 255, ${240 + Math.random() * 15}, 1) 0%, rgba(255, 255, ${220 + Math.random() * 35}, 0.8) 40%, transparent 70%)`,
                    boxShadow: `0 0 ${12 + Math.random() * 8}px rgba(255, 255, 255, 1)`,
                    opacity: effectIntensity * 0.9,
                    animation: `brilliantParticle ${4 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: Math.random() * 2 + 's'
                }}
            />
        ));
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            onClick={onCardClick}
        >
            {children}

            {shouldShowEffect && (
                <>
                    <div className="absolute inset-0 pointer-events-none">
                        {generateLightBeams(8)}
                    </div>

                    <div className="absolute inset-0 pointer-events-none p-4">
                        {generateBrilliantParticles(12)}
                    </div>

                    <div
                        className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 240, 0.8) 30%, transparent 70%)',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: `0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, ${effectIntensity * 0.8})`,
                            opacity: effectIntensity,
                            animation: 'centralFlash 6s ease-in-out infinite'
                        }}
                    />

                    <div
                        className="absolute top-1/2 left-1/2 w-16 h-1 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
                            transform: 'translate(-50%, -50%)',
                            opacity: effectIntensity * 0.9,
                            animation: 'starPoint 3s ease-in-out infinite',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
                        }}
                    />

                    <div
                        className="absolute top-1/2 left-1/2 w-1 h-16 pointer-events-none"
                        style={{
                            background: 'linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
                            transform: 'translate(-50%, -50%)',
                            opacity: effectIntensity * 0.9,
                            animation: 'starPoint 3s ease-in-out infinite',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            boxShadow: `0 0 60px rgba(255, 255, 255, ${effectIntensity * 0.7}), 0 0 120px rgba(255, 255, 255, ${effectIntensity * 0.5}), inset 0 0 40px rgba(255, 255, 255, ${effectIntensity * 0.2})`,
                            borderRadius: 'inherit'
                        }}
                    />

                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            background: `radial-gradient(ellipse at center, rgba(255, 255, 255, ${effectIntensity * 0.2}) 0%, rgba(255, 255, 240, ${effectIntensity * 0.1}) 40%, transparent 70%)`,
                            animation: 'hopePulse 4s ease-in-out infinite'
                        }}
                    />
                </>
            )}
        </div>
    );
};

// NEUTRAL - Simple Card (no effects)
const NeutralCard = ({entry, emotion, onCardClick, isLoading, children}: EmotionCard) => {
    return (
        <div className="relative overflow-hidden w-full h-full" onClick={onCardClick}>
            {children}
        </div>
    );
};

const EmotionEffectCard = ({entry, emotion, onCardClick, isLoading, children, fadeProgress}: EmotionCard) => {
    const CardComponent: {// @ts-ignore
        [key: EmotionAnalysis['emotion']]: React.ComponentType<EmotionCard>} = {
        'ANGER': AngerCard,
        'SADNESS': SadnessCard,
        'ANXIETY': AnxietyCard,
        'JOY': JoyCard,
        'LOVE': LoveCard,
        'FEAR': FearCard,
        'HOPE': HopeCard,
        'NEUTRAL': NeutralCard
    }[entry.emotion] || NeutralCard;

    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                entry.isFullyFaded
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 cursor-default'
                    : `bg-gradient-to-r ${emotion.bgGradient} border-slate-200 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-slate-300`
            } ${isLoading ? 'opacity-50' : ''}`}
        >
            {/*// @ts-ignore*/}
            <CardComponent
                entry={entry}
                emotion={emotion}
                onCardClick={onCardClick}
                isLoading={isLoading}
                fadeProgress={Math.max(0, 100 - fadeProgress)}
            >
                {children}
            </CardComponent>
        </div>
    );
};

export {EmotionEffectCard};