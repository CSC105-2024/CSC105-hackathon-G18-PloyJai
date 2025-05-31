import React, {useState} from 'react';
import {Clock, RectangleEllipsis, RefreshCw, Save, Trash2, User} from 'lucide-react';
import DefaultLayout from "@/components/layout/default.tsx";
import {useSettings} from '@/hooks/use-settings.ts';
import {toast} from 'sonner';
import type {Settings} from "@/types";

function Page() {
    const {settings, loading, error, updateSettings, refetch} = useSettings();
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Local state for form values
    const [formSettings, setFormSettings] = useState<Settings>(settings || {
        angerFadeRate: 2.0,
        sadnessFadeRate: 1.5,
        anxietyFadeRate: 1.8,
        joyFadeRate: 0.3,
        fearFadeRate: 0.3,
        loveFadeRate: 0.2,
        hopeFadeRate: 0.2,
        neutralFadeRate: 1.0,
    });

    // Update form when settings load
    React.useEffect(() => {
        if (settings) {
            setFormSettings(settings);
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);

        try {
            await updateSettings(formSettings);
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        } catch (err: any) {
            setSaveError(err.response?.data?.error || err.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSliderChange = (key: string, value: number) => {
        setFormSettings(prev => ({...prev, [key]: value}));
    };

    const handleDeleteAccount = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/account`, {
                method: 'DELETE',
                credentials: 'include',
            });

            window.location.href = '/';
        } catch (err) {
            console.error('Account deletion failed:', err);
            toast.error('Failed to delete account. Please try again.');
        }
    };

    const emotions = {
        anger: {name: 'Anger', icon: '🔥', description: 'Fades quickly to reduce pain'},
        sadness: {name: 'Sadness', icon: '💧', description: 'Moderate fade for healing time'},
        anxiety: {name: 'Anxiety', icon: '⚡', description: 'Fades fairly fast for peace of mind'},
        joy: {name: 'Joy', icon: '☀️', description: 'Lasts longest to preserve good memories'},
        fear: {name: 'Fear', icon: '👻', description: 'Fades fast to get away from bad memories'},
        love: {name: 'Love', icon: '💖', description: 'Endures long to keep warmth'},
        hope: {name: 'Hope', icon: '🕯️', description: 'Faithful fade to make wish becomes true'},
        neutral: {name: 'Peaceful', icon: '✨', description: 'Natural balanced fade'}
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div
                    className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                    <div className="text-center">
                        <div
                            className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading your settings...</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (error) {
        return (
            <DefaultLayout>
                <div
                    className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">❌</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Settings</h3>
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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-800 mb-2">
                                    PloyJai Settings
                                </h1>
                                <p className="text-indigo-600">
                                    Customize Your Release Journey
                                </p>
                            </div>
                            <button
                                onClick={refetch}
                                className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                disabled={loading}
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Success Message */}
                    {showSaveSuccess && (
                        <div
                            className="mb-6 p-4 bg-green-100 border border-green-300 rounded-2xl flex items-center gap-3">
                            <div className="text-green-600">✅</div>
                            <span className="text-green-800 font-medium">Settings saved successfully!</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {saveError && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-2xl flex items-center gap-3">
                            <div className="text-red-600">❌</div>
                            <span className="text-red-800 font-medium">Error: {saveError}</span>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Fade Rate Settings */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-indigo-200 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Clock size={24} className="text-indigo-600"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Emotion Fade Rates</h2>
                                    <p className="text-gray-600">Adjust how quickly each emotion fades away</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {Object.entries(emotions).map(([key, emotion]) => {
                                    const settingKey = `${key}FadeRate`;
                                    const value = formSettings[settingKey as keyof Settings] as number || 1.0;

                                    return (
                                        <div key={key}
                                             className="flex flex-col md:flex-row max-md:flex-1 md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                                            <div className="flex flex-col md:flex-row items-center gap-4">
                                                <span className="text-2xl">{emotion.icon}</span>
                                                <div>
                                                    <div className="font-medium text-gray-800">{emotion.name}</div>
                                                    <div className="text-sm text-gray-600">{emotion.description}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 min-w-48">
                                                <span className="text-sm text-gray-600 w-16">
                                                    {value <= 0.3 ? 'Very Slow' :
                                                        value <= 0.6 ? 'Slow' :
                                                            value <= 1.0 ? 'Normal' :
                                                                value <= 1.5 ? 'Fast' :
                                                                    'Very Fast'}
                                                </span>
                                                <input
                                                    type="range"
                                                    min="0.2"
                                                    max="3.0"
                                                    step="0.1"
                                                    value={value}
                                                    onChange={(e) => handleSliderChange(settingKey, parseFloat(e.target.value))}
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                />
                                                <span className="text-xs text-gray-500 w-8">{value.toFixed(1)}x</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Account Management */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-red-200 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-red-600"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Account Management</h2>
                                    <p className="text-gray-600">Edit or delete your account</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowEditConfirm(true)}
                                    className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center gap-3 transition-colors"
                                >
                                    <RectangleEllipsis size={20} className="text-amber-600"/>
                                    <span className="font-medium text-amber-800">Change Password</span>
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center gap-3 transition-colors"
                                >
                                    <Trash2 size={20} className="text-red-600"/>
                                    <span className="font-medium text-red-800">Delete Account & All Data</span>
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-2xl flex items-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20}/>
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Confirmation Modal */}
                {showEditConfirm && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-red-200">
                            <div className="text-center mb-6">
                                <div
                                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={32} className="text-red-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-2">Confirm Account Deletion</h3>
                                <p className="text-red-600">
                                    This action cannot be undone. Your entire garden and all entries will be permanently
                                    deleted.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEditConfirm(false)}
                                    className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-red-200">
                            <div className="text-center mb-6">
                                <div
                                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={32} className="text-red-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-2">Confirm Account Deletion</h3>
                                <p className="text-red-600">
                                    This action cannot be undone. Your entire garden and all entries will be permanently
                                    deleted.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Page;