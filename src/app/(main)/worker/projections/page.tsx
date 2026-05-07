'use client';

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    TrendingUp,
    Calendar,
    Target,
    ArrowRight,
    Zap,
    DollarSign,
    PieChart,
    LineChart,
    BarChart3,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function EarningsProjections() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');
    const [monthlyGoal, setMonthlyGoal] = useState(5000);
    const [weeklyGoal, setWeeklyGoal] = useState(1200);
    const [avgJobValue, setAvgJobValue] = useState(145);

    // Mock Data
    const currentSecureEarning = 2100;
    const pendingEarning = 850;
    const totalCurrent = currentSecureEarning + pendingEarning;

    const activeGoal = timeframe === 'monthly' ? monthlyGoal : weeklyGoal;

    const jobsRequired = useMemo(() => {
        const remaining = Math.max(0, activeGoal - (timeframe === 'monthly' ? totalCurrent : totalCurrent / 4));
        return Math.ceil(remaining / avgJobValue);
    }, [activeGoal, totalCurrent, avgJobValue, timeframe]);

    const progressPercentage = useMemo(() => {
        const currentRef = timeframe === 'monthly' ? totalCurrent : totalCurrent / 4;
        return Math.min(100, (currentRef / activeGoal) * 100);
    }, [totalCurrent, activeGoal, timeframe]);

    return (
        <div className="bg-background min-h-screen pb-24 text-foreground dark overflow-x-hidden">
            {/* Header */}
            <header className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/80 border border-border/50 hover:bg-secondary transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Earning Planner</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Growth & Strategy</p>
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-8 max-w-2xl mx-auto">
                {/* 1. The Big Number (Current Trajectory) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2 py-4"
                >
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Projected Monthly Revenue</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                            ${(totalCurrent + (1250)).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Growth Velocity +12%</span>
                    </div>
                </motion.div>

                {/* 2. visual Progress Ring / Bar */}
                <div className="relative pt-4 px-2">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{timeframe === 'monthly' ? 'Monthly' : 'Weekly'} Goal Progress</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black">${(timeframe === 'monthly' ? totalCurrent : totalCurrent / 4).toLocaleString()}</span>
                                <span className="text-sm font-bold text-muted-foreground">of ${activeGoal.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-primary">{Math.round(progressPercentage)}%</span>
                        </div>
                    </div>
                    <div className="h-4 bg-secondary/30 rounded-full overflow-hidden border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-blue-400 relative"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[shimmer_2s_linear_infinite]" />
                        </motion.div>
                    </div>
                </div>

                {/* 3. Breakdown Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 border border-border/50 rounded-3xl p-5 space-y-4">
                        <div className="bg-green-500/10 h-10 w-10 rounded-xl flex items-center justify-center border border-green-500/20">
                            <Zap className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Secured</p>
                            <p className="text-xl font-black">${currentSecureEarning.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-secondary/20 border border-border/50 rounded-3xl p-5 space-y-4">
                        <div className="bg-amber-500/10 h-10 w-10 rounded-xl flex items-center justify-center border border-amber-500/20">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Potential</p>
                            <p className="text-xl font-black">${pendingEarning.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* 4. Interactive Calculator */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Target className="h-24 w-24" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight italic">Smart Strategy Hub</h3>
                                <p className="text-white/70 text-sm font-medium">Fine-tune your targets to see the path forward.</p>
                            </div>

                            {/* Timeframe Toggle */}
                            <div className="bg-white/10 p-1 rounded-xl flex gap-1">
                                <button
                                    onClick={() => setTimeframe('weekly')}
                                    className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", timeframe === 'weekly' ? "bg-white text-indigo-600" : "text-white/60 hover:text-white")}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setTimeframe('monthly')}
                                    className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", timeframe === 'monthly' ? "bg-white text-indigo-600" : "text-white/60 hover:text-white")}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Earning Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 uppercase">Target {timeframe} Income</label>
                                    <span className="text-3xl font-black leading-none">${activeGoal.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min={timeframe === 'weekly' ? 200 : 1000}
                                    max={timeframe === 'weekly' ? 4000 : 15000}
                                    step={timeframe === 'weekly' ? 100 : 500}
                                    value={activeGoal}
                                    onChange={(e) => timeframe === 'monthly' ? setMonthlyGoal(parseInt(e.target.value)) : setWeeklyGoal(parseInt(e.target.value))}
                                    className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                />
                            </div>

                            {/* Average Job Value Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Average Job Value</label>
                                    <span className="text-xl font-black leading-none">${avgJobValue}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="10"
                                    value={avgJobValue}
                                    onChange={(e) => setAvgJobValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-white/80"
                                />
                            </div>
                        </div>

                        {/* Result Analysis */}
                        <div className="bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/10">
                            <div className="grid grid-cols-2 gap-6 divide-x divide-white/10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Jobs Required</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl font-black">{jobsRequired}</span>
                                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                                    </div>
                                </div>
                                <div className="pl-6 space-y-1">
                                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Effort Estimate</p>
                                    <p className="text-xl font-black leading-none mt-2">
                                        {jobsRequired > 20 ? 'Intense' : jobsRequired > 10 ? 'Standard' : 'Casual'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-white/70 text-[11px] font-medium italic">
                                        Based on your average of ${avgJobValue}/job, you need <span className="text-white font-black">{jobsRequired} more assignments</span> to hit your ${monthlyGoal.toLocaleString()} target.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/worker/dashboard')}
                                    className="h-12 w-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                >
                                    <ArrowRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Quick Insight Section */}
                <div className="px-1 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Earning Predictions</h4>
                    <div className="space-y-3">
                        {[
                            { label: 'Weekly Velocity', value: '$1,400', color: 'text-primary' },
                            { label: 'Historical Trend', value: '+5.4%', color: 'text-green-500' },
                            { label: 'Best Earning Day', value: 'Fridays', color: 'text-purple-400' },
                        ].map((stat, i) => (stat && (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-border/30">
                                <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
                                <span className={cn("font-black tracking-tight", stat.color)}>{stat.value}</span>
                            </div>
                        )))}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
