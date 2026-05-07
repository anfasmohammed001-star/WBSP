'use client';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Settings, HelpCircle, LogOut, Clock, Info, BarChart3, Calendar, MessageSquare, PlusCircle as SidebarClose, Wallet, TrendingUp, Users, GitCompare, CreditCard, LineChart, Crown, Gift, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface HamburgerMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const { theme } = useTheme();
    const { user } = useAuth();
    const isWorker = user?.userType === 'worker';

    const customerItems = [
        { label: 'Home', icon: Home, route: '/dashboard', color: 'text-primary' },
        { label: 'Post New Job', icon: SidebarClose, route: '/post-job', color: 'text-blue-500' }, // Using SidebarClose as placeholder if SidebarOpen/Plus isn't available, or reuse Plus? Let's check imports. Added Plus below.
        { label: 'My Orders', icon: Clock, route: '/jobs/history', color: 'text-orange-500' },
        { label: 'Messages', icon: MessageSquare, route: '/chat/hub', color: 'text-green-500' },
        { label: 'Balance Tools', icon: Wallet, route: '/worker/balance-tools', color: 'text-indigo-500' },
        { label: 'Career Path', icon: TrendingUp, route: '/worker/career-path', color: 'text-pink-500' },
        { label: 'Client Management', icon: Users, route: '/worker/client-manager-legacy', color: 'text-teal-500' },
        { label: 'Hall of Fame', icon: Crown, route: '/community/hall-of-fame', color: 'text-yellow-500' },
        { label: 'Rewards Matrix', icon: Gift, route: '/customer/rewards', color: 'text-pink-500' },
        { label: 'Credit System', icon: CreditCard, route: '/credit-system-legacy', color: 'text-yellow-500' },
        { label: 'Earnings Projection', icon: LineChart, route: '/worker/earnings-projections-legacy', color: 'text-cyan-500' },
        { label: 'Support', icon: HelpCircle, route: '/support', color: 'text-purple-500' },
    ];

    const workerItems = [
        { label: 'Dashboard', icon: Home, route: '/worker/dashboard', color: 'text-primary' },
        { label: 'Job History', icon: Clock, route: '/worker/history', color: 'text-blue-500' },
        { label: 'Messages', icon: MessageSquare, route: '/chat/hub', color: 'text-green-500' },
        { label: 'My Schedule', icon: Calendar, route: '/worker/schedule', color: 'text-purple-500' },
        { label: 'Performance Analytics', icon: BarChart3, route: '/worker/earnings', color: 'text-green-500' },
        { label: 'Market Strategy', icon: LineChart, route: '/worker/projections', color: 'text-cyan-500' },
        { label: 'Balance Tools', icon: Wallet, route: '/worker/balance-tools', color: 'text-indigo-500' },
        { label: 'Career Path', icon: TrendingUp, route: '/worker/career-path', color: 'text-pink-500' },
        { label: 'Worker Academy', icon: Crown, route: '/worker/academy', color: 'text-yellow-500' },
        { label: 'Rapid Vector Scan', icon: Radar, route: '/worker/rapid-scan', color: 'text-primary' },
        { label: 'Client Management', icon: Users, route: '/worker/client-manager-legacy', color: 'text-teal-500' },
        { label: 'Hall of Fame', icon: Crown, route: '/community/hall-of-fame', color: 'text-yellow-500' },
        { label: 'Credit System', icon: CreditCard, route: '/credit-system-legacy', color: 'text-yellow-500' },
        { label: 'Settings', icon: Settings, route: '/worker/settings', color: 'text-gray-400' },
        { label: 'Help & Support', icon: HelpCircle, route: '/help', color: 'text-gray-400' },
        { label: 'About Platform', icon: Info, route: '/about', color: 'text-gray-400' },
    ];

    const menuItems = isWorker ? workerItems : customerItems;

    const handleLogout = () => {
        navigate('/login');
        onClose();
    };

    const isActive = (route: string) => pathname === route;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                        onClick={onClose}
                    />

                    {/* Slide-out Menu */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed top-0 left-0 h-full w-[85%] max-w-sm shadow-2xl z-50 flex flex-col pt-12",
                            theme === 'dark' ? "bg-[#0F172A] text-white border-r border-gray-800" : "bg-white text-slate-900"
                        )}
                    >
                        {/* Profile Info */}
                        <div className="px-8 pb-10 flex flex-col items-start space-y-4">
                            <div className="relative">
                                <div className={cn(
                                    "h-20 w-20 rounded-2xl overflow-hidden border-2",
                                    theme === 'dark' ? "border-primary/50" : "border-gray-100"
                                )}>
                                    <img src={user?.avatarUrl || "https://i.pravatar.cc/150?u=a1"} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-white dark:border-[#0F172A]" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight">{user?.fullName || "Alexander Sterling"}</h2>
                                <div className="flex items-center space-x-2">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm",
                                        isWorker ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30" : "bg-indigo-600 text-white"
                                    )}>
                                        {isWorker ? "Premium Worker" : "Premium Client"}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 tabular-nums">• ID: #8821</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.route}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 group",
                                        theme === 'dark'
                                            ? "hover:bg-blue-600/10 hover:shadow-inner"
                                            : "hover:bg-gray-100"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        theme === 'dark' ? "bg-gray-800/50 text-white" : "text-gray-400"
                                    )}>
                                        <item.icon className={cn("h-5 w-5", item.color && theme !== 'dark' ? item.color : "")} />
                                    </div>
                                    <span className={cn(
                                        "text-base font-bold tracking-tight",
                                        theme === 'dark' ? "text-gray-300 group-hover:text-white" : "text-gray-700"
                                    )}>
                                        {item.label}
                                    </span>
                                    {isActive(item.route) && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Footer / Version */}
                        <div className="p-8 border-t border-gray-100 dark:border-gray-800 space-y-8">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-4 px-2 py-2 text-red-500 font-bold hover:opacity-80 transition-opacity"
                            >
                                <LogOut className="h-6 w-6 -rotate-180" />
                                <span className="text-lg">Logout</span>
                            </button>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">V 2.4.1 (604)</span>
                                <div className="flex space-x-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 opacity-50" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

