'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    History,
    TrendingUp,
    DollarSign,
    Zap,
    Shield,
    Activity,
    LineChart,
    PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function WorkerWallet() {
    const navigate = useNavigate();

    const transactions = [
        { id: 1, title: 'WBSP Vector Payout', date: '27 OCT 10:23 Zulu', amount: '+$450.00', type: 'income', sector: 'PLUMBING' },
        { id: 2, title: 'Thermal Kit Maintenance', date: '26 OCT 14:15 Zulu', amount: '-$120.50', type: 'expense', sector: 'EQUIPMENT' },
        { id: 3, title: 'Alpha Performance Bonus', date: '24 OCT 09:00 Zulu', amount: '+$25.00', type: 'income', sector: 'REWARDS' },
        { id: 4, title: 'Matrix Hub Subscription', date: '20 OCT 08:00 Zulu', amount: '-$15.00', type: 'expense', sector: 'SERVICE' },
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32 font-sans overflow-hidden">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-emerald-500/5 bottom-[10%] -right-[10%] scale-150" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 glass-obsidian border-b border-white/5 px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/70" />
                    </motion.button>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase">Yield Hub</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Financial Vector Terminal</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Ledger: Sync
                </div>
            </header>

            <main className="p-6 relative z-10">
                {/* Total Balance Card - Premium Digital Aspect */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full aspect-[1.8/1] rounded-[2.5rem] overflow-hidden p-8 flex flex-col justify-between shadow-2xl shadow-primary/20 mb-10 group"
                >
                    {/* High-Tech Background */}
                    <div className="absolute inset-0 bg-[#050a14] z-0"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent)] z-[1]"></div>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    Secured Credit Matrix
                                </span>
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Available Liquidity</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                                <Zap className="w-6 h-6 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-6xl font-black text-white mt-4 tracking-tighter tabular-nums">$2,845.<span className="text-3xl opacity-30 italic">00</span></h2>
                    </div>

                    <div className="relative z-10 flex gap-4 mt-6">
                        <Button className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] h-14 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all gap-3 shadow-xl group/btn">
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Provision
                        </Button>
                        <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-[1.5rem] h-14 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl shadow-primary/40 gap-3 group/btn">
                            <ArrowDownLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
                            Liquidate
                        </Button>
                    </div>
                </motion.div>

                {/* Quick Performance Vector Stats */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <Card className="glass-obsidian p-6 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-16 h-16 text-emerald-500" />
                        </div>
                        <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">Alpha Yield (OCT)</p>
                        <h3 className="text-3xl font-black text-emerald-500 mb-1 tracking-tighter">+$1,250</h3>
                        <div className="flex items-center gap-1.5 text-white/20 text-[9px] font-black uppercase tracking-widest">
                            <Activity className="w-3 h-3 text-emerald-500/40" />
                            <span>Vector Strength: High</span>
                        </div>
                    </Card>

                    <Card className="glass-obsidian p-6 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <CreditCard className="w-16 h-16 text-purple-500" />
                        </div>
                        <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">Matrix Drain (OCT)</p>
                        <h3 className="text-3xl font-black text-white/80 mb-1 tracking-tighter">-$320</h3>
                        <div className="flex items-center gap-1.5 text-white/20 text-[9px] font-black uppercase tracking-widest">
                            <PieChart className="w-3 h-3 text-purple-500/40" />
                            <span>System Efficiency: 88%</span>
                        </div>
                    </Card>
                </div>

                {/* Transaction Ledger */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                                <History className="w-5 h-5 text-white/30" />
                                Vector Ledger
                            </h3>
                        </div>
                        <button
                            onClick={() => navigate('/worker/wallet/history')}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                        >
                            Full Protocol Log
                        </button>
                    </div>

                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <motion.div
                                key={tx.id}
                                whileHover={{ x: 5 }}
                                className="glass-obsidian border border-white/5 rounded-2xl p-5 flex items-center justify-between group cursor-pointer transition-all hover:border-primary/20"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:scale-105",
                                        tx.type === 'income' ? "text-emerald-500/80 group-hover:bg-emerald-500/10" : "text-white/40 group-hover:bg-red-500/10"
                                    )}>
                                        <DollarSign className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-base mb-1 tracking-tight group-hover:text-primary transition-colors uppercase">{tx.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none">{tx.date}</p>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 leading-none">{tx.sector}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "text-lg font-black tracking-tighter tabular-nums block",
                                        tx.type === 'income' ? "text-emerald-500" : "text-white"
                                    )}>
                                        {tx.amount}
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/10">Vector Verified</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
