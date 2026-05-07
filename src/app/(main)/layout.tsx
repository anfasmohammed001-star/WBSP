'use client';

import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HamburgerMenu from '@/components/layout/HamburgerMenu';
import { useState } from 'react';
import toast from 'react-hot-toast';
import GeminiAssistant from '@/components/ai/GeminiAssistant';
import { FeedbackWidget } from '@/components/ui/FeedbackWidget';
import SearchOverlay from '@/components/layout/SearchOverlay';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate() as any;
    const location = useLocation();
    const pathname = location.pathname;
    const { user } = useAuth();

    const handleLogoClick = () => {
        if (user?.userType === 'worker') {
            navigate('/worker/dashboard');
        } else if (user?.userType === 'supervisor') {
            navigate('/supervisor/dashboard');
        } else {
            navigate('/customer/dashboard');
        }
    };

    const isActive = (route: string) => {
        // Special case for Home/Dashboard paths
        if (route === '/customer/dashboard' || route === '/worker/dashboard' || route === '/supervisor/dashboard') {
            return pathname === route;
        }
        return pathname?.startsWith(route);
    };

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-background text-foreground">
            {/* Unified Header / Menu Bar - Optimized for Mobile */}
            <header className="sticky top-0 z-40 px-6 h-18 sm:h-24 flex items-center justify-between glass-morphism border-b border-white/5 shadow-premium backdrop-blur-[20px] pt-[env(safe-area-inset-top,0px)] box-content">
                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-6">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden h-12 w-12 flex items-center justify-center rounded-[1.2rem] transition-all bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10"
                    >
                        <Menu className="h-5 w-5 text-white/70" />
                    </motion.button>
                    <span
                        className="font-black text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-indigo-600 cursor-pointer select-none"
                        onClick={handleLogoClick}
                    >
                        WBSP
                    </span>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSearchOpen(true)}
                        className="h-12 w-12 hidden md:flex items-center justify-center rounded-[1.2rem] transition-all relative bg-white/5 hover:bg-white/10 border border-white/10 group"
                    >
                        <Search className="h-5 w-5 text-white/50 group-hover:text-primary transition-colors" />
                    </motion.button>

                    <motion.button
                        onClick={() => navigate('/notifications-legacy')}
                        className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] transition-all relative bg-white/5 hover:bg-white/10 border border-white/10 group"
                    >
                        <Bell className="h-5 w-5 text-white/50 group-hover:text-primary transition-colors" />
                        <div className="absolute top-3.5 right-3.5 h-2 w-2 bg-primary rounded-full ring-4 ring-black/20" />
                    </motion.button>

                    {user ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate(user.userType === 'worker' ? '/worker/profile' : '/customer/profile')}
                            className="flex items-center gap-3 pl-1.5 pr-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-[1.4rem] border border-white/10 transition-all group"
                        >
                            <div className="relative">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-xl object-cover border border-primary/20" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                                        {user.fullName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0c14]" />
                            </div>
                            <div className="hidden sm:flex flex-col items-start pr-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">Access Level</span>
                                <span className="text-xs font-black leading-none text-white/90">{user.userType === 'worker' ? 'OPERATIVE' : 'CLIENT'}</span>
                            </div>
                        </motion.button>
                    ) : (
                        <Button
                            onClick={() => navigate('/login')}
                            variant="premium"
                            size="lg"
                            className="hidden md:flex rounded-2xl"
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content Area with Page Transition */}
            <main className="flex-1 pb-32 no-scrollbar relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
                <GeminiAssistant />
                <FeedbackWidget />
            </main>

            {/* Navigation Components */}
            <BottomNavigation />
            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
