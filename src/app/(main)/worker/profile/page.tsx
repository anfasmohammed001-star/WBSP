'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Settings, Shield, Award, MapPin, Star,
    Calendar, Clock, Edit3, Share2, MoreHorizontal,
    Zap, Target, Activity, Cpu, Globe, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function WorkerProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const stats = [
        { label: 'SUCCESS RATE', value: '99.4%', icon: Target, color: 'text-emerald-500' },
        { label: 'MISSIONS', value: '142', icon: Activity, color: 'text-primary' },
        { label: 'REP SCORE', value: '4.98', icon: Star, color: 'text-amber-500' },
        { label: 'XP YIELD', value: '24.5K', icon: Zap, color: 'text-purple-500' }
    ];

    const badges = [
        { name: 'Sector Lead', icon: Shield, color: 'bg-primary/20 text-primary' },
        { name: 'Night Owl', icon: Clock, color: 'bg-purple-500/20 text-purple-400' },
        { name: 'Rapid Response', icon: Zap, color: 'bg-amber-500/20 text-amber-500' },
        { name: 'Elite Status', icon: Award, color: 'bg-emerald-500/20 text-emerald-500' }
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32 font-sans overflow-hidden">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-purple-600/5 bottom-[20%] -right-[10%] scale-150" />
            </div>

            {/* Header / Hero Section with Profile Picture */}
            <div className="relative h-80 bg-[#050a14] border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-digital-grid opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020408]" />

                <div className="relative z-10 px-8 pt-10 flex items-center justify-between">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/70"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <div className="flex gap-4">
                        <button className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/70 hover:text-primary transition-all">
                            <Share2 className="w-6 h-6" />
                        </button>
                        <button className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/70 hover:text-primary transition-all">
                            <Settings className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Profile Identity Card Overlay */}
                <div className="absolute -bottom-16 left-8 right-8 flex items-end gap-8 z-20">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-600 p-1 shadow-2xl overflow-hidden shadow-primary/40 relative">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} className="w-full h-full object-cover rounded-[2.4rem] border-4 border-[#020408]" />
                            ) : (
                                <div className="w-full h-full bg-[#0a0f1d] rounded-[2.4rem] flex items-center justify-center border-4 border-[#020408]">
                                    <span className="text-5xl font-black text-white/20">{user?.fullName?.[0] || 'U'}</span>
                                </div>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="absolute bottom-2 right-2 p-3 bg-primary rounded-2xl text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <Edit3 className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="absolute -top-3 -right-3 px-4 py-1.5 rounded-xl bg-emerald-500 text-[9px] font-black uppercase tracking-widest border-4 border-[#020408] shadow-xl">
                            Verified
                        </div>
                    </div>

                    <div className="flex-1 pb-4">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-4xl font-black tracking-tighter uppercase">{user?.fullName || 'John Doe'}</h2>
                            <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest leading-none">ALPHA-4</div>
                        </div>
                        <div className="flex items-center gap-6 text-white/30 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5" />
                                <span>CENTRAL REGION</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <div className="flex items-center gap-2 text-primary">
                                <Activity className="w-3.5 h-3.5" />
                                <span>ON DUTY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mt-24 p-8 relative z-10 space-y-12">
                {/* Stats Ledger */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="glass-obsidian border-white/5 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                                <stat.icon className={cn("w-12 h-12", stat.color)} />
                            </div>
                            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <h3 className={cn("text-3xl font-black tracking-tighter tabular-nums", stat.color)}>{stat.value}</h3>
                        </Card>
                    ))}
                </div>

                {/* About & Skill Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="md:col-span-2 glass-obsidian border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Cpu className="w-32 h-32 text-primary" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-primary" />
                            Operative Bio
                        </h3>
                        <p className="text-white/50 text-base leading-relaxed font-medium italic">
                            High-precision maintenance specialist with a focus on hydraulic systems and thermal management.
                            Active in the Central Sector for 4+ years. Certified Alpha-4 Operative with zero critical failure logs.
                        </p>

                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                            {['Hydraulics', 'Thermal Control', 'CAD Interface', 'Tactical Planning'].map(skill => (
                                <span key={skill} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <Card className="glass-obsidian border-white/5 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Badge Matrix</h3>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {badges.map((badge, idx) => (
                                <div key={idx} className={cn("aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 border border-white/5 transition-all hover:scale-105", badge.color)}>
                                    <badge.icon className="w-8 h-8" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Performance Log / Recent Missions */}
                <section>
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4">
                            <Calendar className="w-6 h-6 text-primary" />
                            Recent Deployment Logs
                        </h3>
                        <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5">View Archive</Button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-obsidian border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40 group-hover:text-primary transition-all">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black tracking-tight text-white uppercase group-hover:text-primary transition-colors">Mission Alpha-902</h4>
                                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">
                                            <span>OCT 12, 14:00</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-emerald-500">Completed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="block text-lg font-black tracking-tighter text-white tabular-nums">+$450.00</span>
                                        <span className="text-[8px] font-black uppercase text-white/10 tracking-widest">Verified Yield</span>
                                    </div>
                                    <MoreHorizontal className="w-6 h-6 text-white/10 group-hover:text-white transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <style>{`
                .bg-digital-grid {
                    background-image: linear-gradient(to right, #444 1px, transparent 1px),
                                    linear-gradient(to bottom, #444 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </div>
    );
}
