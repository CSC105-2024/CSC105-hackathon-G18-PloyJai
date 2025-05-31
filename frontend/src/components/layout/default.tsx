import React, {useState} from 'react';
import {BookOpen, Flower, Home, LogOut, Menu, PenTool, Settings, Trash2, User, X} from "lucide-react";
import {Link, Navigate, useLocation} from "react-router";
import {useAuth} from "@/contexts/auth-context.tsx";
import LoadingLayout from "@/components/layout/loading.tsx";
import axiosInstance from "@/lib/axios.ts";
import {toast} from "sonner";

function DefaultLayout({ children }: {children: React.ReactNode | React.ReactNode[]}) {
    const location = useLocation();
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {user, isAuthenticated, isLoading, signOut} = useAuth();

    const navigation = [
        {
            id: 'home',
            name: 'Home',
            path: '/',
            icon: Home,
            description: 'Overview of your journey'
        },
        {
            id: 'write',
            name: 'Write Entry',
            path: '/write',
            icon: PenTool,
            description: 'Write to release'
        },
        {
            id: 'entries',
            name: 'My Entries',
            path: '/entries',
            icon: BookOpen,
            description: 'Watch emotions fade'
        },
        {
            id: 'garden',
            name: 'Release Garden',
            path: '/garden',
            icon: Flower,
            description: 'Beauty from pain'
        },
        {
            id: 'settings',
            name: 'Settings',
            path: '/settings',
            icon: Settings,
            description: 'Customize experience'
        }
    ];

    const handleSignOut = async () => {
        try {
            await signOut();

            toast.success('Sign out successfully');
        } catch (err) {
            console.error('Sign out failed:', err);
            toast.error('Failed to sign out. Please try again.');
        }
    }

    if (isLoading) {
        return <LoadingLayout/>;
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate to="/authentication/sign-in" />
        )
    }

    return (
        <div className="min-h-[calc(100svh+56.67px)] md:min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Logo */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
                        <h1 className="text-xl font-bold text-white">PloyJai</h1>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-purple-100 text-purple-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                            location.pathname === item.path ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    <div>
                                        <div>{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200">
                        <button onClick={() => setShowSignOutConfirm(true)} className="group flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile header */}
            <div className="lg:hidden">
                <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="ml-2 text-xl font-bold text-purple-600">PloyJai</h1>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
                            <h1 className="text-xl font-bold text-white">PloyJai</h1>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-md text-purple-200 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mobile User Info */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors ${
                                            location.pathname === item.path
                                                ? 'bg-purple-100 text-purple-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon
                                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                                location.pathname === item.path ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        />
                                        <div>
                                            <div>{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Logout */}
                        <div className="p-4 border-t border-gray-200">
                            <button onClick={() => setShowSignOutConfirm(true)} className="group flex items-center px-2 py-2 text-sm font-medium rounded-lg w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="max-md:pb-16 lg:pl-64 flex flex-col flex-1">
                <main className="flex-1">
                    {children}
                </main>
            </div>

            {/* Mobile bottom navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="grid grid-cols-5 gap-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                                    location.pathname === item.path
                                        ? 'text-purple-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon size={20} className="mb-1" />
                                <span className="truncate">{item.name.split(' ')[0]}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {showSignOutConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-red-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut size={32} className="text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-amber-800 mb-2">You are about to be Sign Out</h3>
                            <p className="text-amber-600">
                                Your entire garden and all entries will be still staying with us.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSignOutConfirm(false)}
                                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DefaultLayout;