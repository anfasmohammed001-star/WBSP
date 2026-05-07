'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Smile, Frown, Coffee, Zap, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function WorkerWellness() {
    const navigate = useNavigate();
    const [mood, setMood] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#020817] text-white pb-24 font-sans">
            {/* Header */}
            <div className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-10 px-6 py-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-400"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    Wellness Hub
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </h1>
            </div>

            {/* Content */}
            <div className="p-6">

                {/* Mood Checker */}
                <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 text-center mb-8 shadow-2xl shadow-blue-900/10">
                    <h2 className="text-xl font-black text-white mb-2">How are you feeling, Mario?</h2>
                    <p className="text-slate-400 text-sm mb-6">Tracking your mood helps prevent burnout.</p>

                    <div className="flex justify-center gap-4 mb-6">
                        {[
                            { icon: Frown, label: "Stressed", color: "text-red-400", bg: "bg-red-500/10", border: 'border-red-500/20' },
                            { icon: Coffee, label: "Tired", color: "text-amber-400", bg: "bg-amber-500/10", border: 'border-amber-500/20' },
                            { icon: Smile, label: "Great", color: "text-emerald-400", bg: "bg-emerald-500/10", border: 'border-emerald-500/20' },
                            { icon: Zap, label: "Energetic", color: "text-blue-400", bg: "bg-blue-500/10", border: 'border-blue-500/20' },
                        ].map((m, i) => (
                            <button
                                key={m.label}
                                onClick={() => setMood(m.label)}
                                className={cn(
                                    "flex flex-col items-center gap-2 transition-all p-3 rounded-2xl border",
                                    mood === m.label
                                        ? `scale-110 ${m.bg} ${m.border} ring-2 ring-white/10`
                                        : "bg-transparent border-transparent hover:bg-white/5"
                                )}
                            >
                                <m.icon className={cn("w-8 h-8", m.color)} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
                            </button>
                        ))}
                    </div>

                    {mood && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white/5 border border-white/5 rounded-xl p-4 text-left"
                        >
                            <h4 className="font-bold text-white text-sm mb-1">Tip for today:</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {mood === 'Stressed' || mood === 'Tired'
                                    ? "Take a quick 15-minute break. Step outside, breathe some fresh air, and hydrate. Your health comes first."
                                    : "You're on fire! Use this energy to tackle that complex installation or mentor a junior team member."
                                }
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Burnout Monitor */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-slate-400" />
                            Work-Life Balance
                        </h3>
                        <span className="text-xs font-bold text-emerald-400">Healthy</span>
                    </div>
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase">
                            <span>Weekly Hours</span>
                            <span className="text-white">38h / 40h</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 w-[85%] rounded-full" />
                        </div>
                        <p className="text-xs text-slate-400">
                            You're maintaining a great schedule. Consider taking Sunday off to fully recharge.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Coffee className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-white">Meditate (5m)</span>
                    </button>
                    <button className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-white">Connect Support</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
