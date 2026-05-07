'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Sparkles, Target, Zap,
    DollarSign, Clock, Shield, Search,
    Cpu, Activity, BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function AIEstimator() {
    const navigate = useNavigate();
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        setCalculating(true);
        setTimeout(() => {
            setCalculating(false);
            setResult({
                range: '$240 - $310',
                accuracy: '94%',
                operatives: 12,
                time: '2.5h'
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32 font-sans overflow-hidden">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/20 -top-[10%] -left-[10%] scale-150 rotate-45" />
                <div className="blob bg-purple-600/10 bottom-[20%] -right-[10%] scale-150" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 glass-obsidian border-b border-white/5 px-8 py-8 flex items-center gap-6">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10"
                >
                    <ChevronLeft className="w-6 h-6 text-white/70" />
                </motion.button>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">AI Budget Matrix</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Estimation Protocol</p>
                </div>
            </header>

            <main className="p-8 max-w-2xl mx-auto w-full relative z-10">
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-4 mb-3">
                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Mission Parameters</h2>
                        </div>
                        <p className="text-white/40 text-sm italic">Analyze historical vector data to project resource requirements.</p>
                    </section>

                    <Card className="glass-obsidian p-8 border-white/5 relative group overflow-hidden">
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 block">Sector Signal</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Plumbing', 'Electrical', 'Tech'].map(sector => (
                                        <button key={sector} className="py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:bg-primary/10 transition-all">
                                            {sector}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 block">Complexity Threshold</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button key={v} className="flex-1 h-12 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black hover:bg-primary hover:border-primary transition-all">
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={calculating}
                                className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(37,99,235,0.4)] relative overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {calculating ? 'Processing Flux...' : 'Execute Calculation'}
                                </span>
                                {calculating && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    />
                                )}
                            </Button>
                        </div>
                    </Card>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <Card className="glass-obsidian p-8 border-emerald-500/20 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <DollarSign className="w-12 h-12 text-emerald-500" />
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Projected Yield</span>
                                        <h3 className="text-4xl font-black text-emerald-500 tabular-nums tracking-tighter">{result.range}</h3>
                                    </Card>

                                    <Card className="glass-obsidian p-8 border-primary/20 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Target className="w-12 h-12 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Matrix Confidence</span>
                                        <h3 className="text-4xl font-black text-primary tabular-nums tracking-tighter">{result.accuracy}</h3>
                                    </Card>
                                </div>

                                <Card className="glass-obsidian border-white/5 p-8 rounded-[2.5rem]">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-3">
                                            <Cpu className="w-4 h-4" />
                                            <span>Active Operatives in Proximity: <span className="text-white">{result.operatives}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4" />
                                            <span>Est. Deployment: <span className="text-white">{result.time}</span></span>
                                        </div>
                                    </div>
                                </Card>

                                <Button className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                                    Log Estimate to Mission Briefing
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
