

import {
    Search,
    Wallet as WalletIcon,
    User,
    ShieldCheck,
    HelpCircle,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft,
    TrendingUp,
    Video,
    History,
    Gift,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SupportHub() {
    const navigate = useNavigate();

    const categories = [
        { label: 'Wallet', icon: WalletIcon, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/wallet' },
        { label: 'Account', icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/profile' },
        { label: 'Security', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10', path: '/settings' },
        { label: 'Support', icon: HelpCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/messages' },
    ];

    const verifications = [
        {
            title: 'Verification Complete',
            desc: 'Your profile is fully verified and secure.',
            status: 'completed',
            icon: CheckCircle2,
            color: 'text-green-500',
            badge: 'bg-green-500/10 text-green-600 dark:text-green-400',
            onClick: () => navigate('/profile')
        },
        {
            title: 'In Progress',
            desc: 'ID Scan being reviewed by our team.',
            status: 'pending',
            icon: Clock,
            color: 'text-blue-500',
            badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            onClick: () => toast('Verification in progress. We will notify you once complete.', { icon: '⏳' })
        },
        {
            title: 'Action Required',
            desc: 'Add a payment method to unlock full access.',
            status: 'required',
            icon: AlertCircle,
            color: 'text-red-500',
            badge: 'bg-red-500/10 text-red-600 dark:text-red-400',
            onClick: () => navigate('/wallet')
        }
    ];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            toast('Search is currently unavailable. Please browse the topics below.', { icon: '🔍' });
        }
    };

    return (
        <div className="bg-background min-h-screen pb-24 transition-colors duration-300 text-foreground max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Header */}
            <div className="p-6 bg-card space-y-6 rounded-b-[2.5rem] shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <h1 className="text-xl font-black text-foreground">Support Hub</h1>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        onKeyDown={handleSearch}
                        className="w-full bg-secondary border-none rounded-2xl h-14 pl-12 pr-4 font-bold text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Community', icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/community-legacy' },
                        { label: 'Job History', icon: History, color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/worker/job-history-legacy' },
                        { label: 'AR Help', icon: WalletIcon, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/ar-visualizer' },
                        { label: 'Quality Control', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10', path: '/worker/quality-control-legacy' },
                        { label: 'Reward Store', icon: Gift, color: 'text-pink-500', bg: 'bg-pink-500/10', path: '/worker/rewards-legacy' },
                        { label: 'Safety Guidelines', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', path: '/safety-guidelines-legacy' },
                        { label: 'Settings', icon: Settings, color: 'text-cyan-500', bg: 'bg-cyan-500/10', path: '/worker/settings-legacy' },
                        { label: 'Wallet', icon: WalletIcon, color: 'text-rose-500', bg: 'bg-rose-500/10', path: '/worker/wallet-legacy' },
                    ].map((cat) => (
                        <motion.button
                            key={cat.label}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(cat.path)}
                            className="bg-card p-6 rounded-[2rem] border border-border flex flex-col items-center space-y-3 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className={cn("p-4 rounded-2xl", cat.bg)}>
                                <cat.icon className={cn("h-6 w-6", cat.color)} />
                            </div>
                            <span className="text-sm font-black text-foreground tracking-tight">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Verification Hub */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black tracking-tight text-foreground px-2">Verification Hub</h3>
                    <div className="space-y-4">
                        {verifications.map((v) => (
                            <div
                                key={v.title}
                                onClick={v.onClick}
                                className="bg-card p-5 rounded-[2rem] border border-border flex items-center space-x-4 hover:border-primary/30 transition-colors cursor-pointer"
                            >
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-secondary", v.badge.replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-opacity-100 text-'))}>
                                    <v.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-foreground">{v.title}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{v.desc}</p>
                                </div>
                                <button className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Topics */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black tracking-tight text-foreground px-2">Popular Topics</h3>
                    <div className="bg-card rounded-[2rem] border border-border divide-y divide-border">
                        {['How to add a payment method?', 'Is my information secure?', 'How do I change my role?', 'What is AI Smart Match?'].map((topic) => (
                            <button
                                key={topic}
                                onClick={() => toast('Displaying article: ' + topic, { icon: '📄' })}
                                className="w-full flex items-center justify-between p-5 text-left group hover:bg-secondary/30 transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem]"
                            >
                                <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">{topic}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
