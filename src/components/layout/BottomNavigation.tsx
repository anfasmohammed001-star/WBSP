'use client';

import { Link, useLocation } from 'react-router-dom';

import { MessageSquare, Home, User, Compass, Wallet, PlusCircle, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

import { motion, AnimatePresence } from 'framer-motion';

export default function BottomNavigation() {
    const location = useLocation();
    const pathname = location.pathname;
    const { user } = useAuth();

    // Robust check: Auth User Type OR Pathname Context
    const isWorkerContext = user?.userType === 'worker' || pathname?.startsWith('/worker');

    const isActive = (route: string) => {
        if (route === '/customer/dashboard' && pathname === '/customer/dashboard') return true;
        if (route === '/worker/dashboard' && pathname === '/worker/dashboard') return true;
        if (route !== '/customer/dashboard' && route !== '/worker/dashboard' && pathname?.startsWith(route)) return true;
        return false;
    };

    const customerItems = [
        { label: 'Home', icon: Home, route: '/customer/dashboard' },
        { label: 'Discovery', icon: Compass, route: '/jobs' },
        { label: 'Post', icon: PlusCircle, route: '/post-job', primary: true },
        { label: 'Chat', icon: MessageSquare, route: '/chat/hub' },
        { label: 'Profile', icon: User, route: '/customer/profile' },
    ];

    const workerItems = [
        { label: 'Home', icon: Home, route: '/worker/dashboard' },
        { label: 'Search', icon: Compass, route: '/worker/jobs/discovery' },
        { label: 'Sync', icon: PlusCircle, route: '/worker/active', primary: true },
        { label: 'Wallet', icon: Wallet, route: '/worker/wallet' },
        { label: 'Account', icon: User, route: '/worker/profile' },
    ];

    const navItems = isWorkerContext ? workerItems : customerItems;

    return (
        <nav className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-6 right-6 h-20 sm:hidden z-50 glass-dark rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-visible px-4 flex flex-col justify-center">
            <div className="flex w-full items-center justify-between relative px-2">
                {navItems.map((item, idx) => {
                    const active = isActive(item.route);

                    return (
                        <Link
                            key={item.label}
                            to={item.route}
                            className={cn(
                                "flex flex-col items-center justify-center h-full relative z-10",
                                item.primary ? "w-16" : "w-12"
                            )}
                        >
                            {item.primary ? (
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute -top-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-4 border-[#0a0a0f]"
                                >
                                    <item.icon className="h-7 w-7 stroke-[3px]" />
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <motion.div
                                        animate={{
                                            y: active ? -4 : 0,
                                            scale: active ? 1.1 : 1
                                        }}
                                        className={cn(
                                            "transition-colors duration-300",
                                            active ? "text-primary" : "text-white/30"
                                        )}
                                    >
                                        <item.icon className={cn("h-6 w-6 stroke-[2.5px]")} />
                                    </motion.div>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute -bottom-1"
                                            >
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
            {/* Decorative Home Indicator for Native Feel */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white/10 w-full"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </div>
        </nav>
    );
}
