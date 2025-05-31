import React from 'react';
import {BookOpen, Flower, PenTool,} from 'lucide-react';
import {Link, Navigate} from "react-router";
import DefaultLayout from "@/components/layout/default.tsx";
import {useAuth} from "@/contexts/auth-context.tsx";
import {useStats} from "@/hooks/use-stats.ts";
import LoadingLayout from '@/components/layout/loading';

function Page() {
    const {user, isLoading: isAuthLoading} = useAuth();
    const {stats, loading: isStatsLoading} = useStats();

    if (isAuthLoading || isStatsLoading) {
        return (
            <LoadingLayout/>
        )
    }

    if (!isAuthLoading && !user) {
        return (
            <Navigate to="/authentication/sign-in"/>
        );
    }

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <div className="max-w-6xl mx-auto px-4 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                PloyJai
                            </h1>
                            <p className="text-xl md:text-2xl mb-2 text-purple-100">
                                Write to Release, Forget to Heal
                            </p>
                            <p className="text-lg text-purple-200">
                                Transform your pain into beauty through the power of letting go
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div
                                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-4xl mb-4">📝</div>
                                <div className="text-3xl font-bold text-purple-800 mb-2">
                                    {stats?.totalEntries}
                                </div>
                                <div className="text-purple-600">Entries Written</div>
                                <div className="text-sm text-purple-500 mt-1">Emotions released</div>
                            </div>

                            <div
                                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-green-200 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-4xl mb-4">🌱</div>
                                <div className="text-3xl font-bold text-green-800 mb-2">
                                    {stats?.totalPlants}
                                </div>
                                <div className="text-green-600">Garden Plants</div>
                                <div className="text-sm text-green-500 mt-1">Pain transformed to beauty</div>
                            </div>

                            <div
                                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 text-center transform hover:scale-105 transition-all duration-300">
                                <div className="text-4xl mb-4">💙</div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {stats?.daysActive}
                                </div>
                                <div className="text-blue-600">Days of Healing</div>
                                <div className="text-sm text-blue-500 mt-1">Your healing journey</div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Begin Your Release Today
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link
                                to="/write"
                                className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <PenTool size={32}/>
                                    <div className="text-left">
                                        <div className="text-xl font-bold">Write New Entry</div>
                                        <div className="text-purple-100">Release your feelings through words</div>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to="/garden"
                                className="p-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <Flower size={32}/>
                                    <div className="text-left">
                                        <div className="text-xl font-bold">Visit Garden</div>
                                        <div className="text-green-100">See the beauty born from release</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                            How PloyJai Works
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PenTool size={32} className="text-purple-600"/>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">1. Write to Release</h3>
                                <p className="text-gray-600">
                                    Pour your emotions onto the page. Don't worry about perfection—just let it flow.
                                </p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={32} className="text-blue-600"/>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">2. Watch Them Fade</h3>
                                <p className="text-gray-600">
                                    Your painful memories slowly fade away. The more you let go, the faster they
                                    transform.
                                </p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Flower size={32} className="text-green-600"/>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">3. Grow Your Garden</h3>
                                <p className="text-gray-600">
                                    Released emotions become beautiful plants in your healing garden.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Philosophy Section */}
                    <div className="text-center">
                        <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                The PloyJai Philosophy
                            </h3>
                            <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
                                <p className="text-lg">
                                    "Pain held becomes suffering, but pain released becomes beauty."
                                </p>
                                <p>
                                    PloyJai believes that writing isn't for remembering, but for releasing.
                                    When we let go of painful emotions, they transform into something beautiful
                                    in the garden of our hearts.
                                </p>
                                <p className="text-purple-600 font-medium">
                                    The paradox of healing: The more you look at pain, the faster it transforms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Page;