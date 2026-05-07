'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Award, PlayCircle, BookOpen, Star, Trophy,
    Zap, Shield, Target, Sparkles, Activity, Search,
    Cpu, Globe, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function WorkerAcademy() {
    const navigate = useNavigate();

    const courses = [
        {
            id: 1,
            title: "Advanced Hydraulic Fitting",
            category: "PLUMBING SECTOR",
            duration: "2H 15M",
            progress: 45,
            image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800",
            participants: 124,
            difficulty: "Alpha"
        },
        {
            id: 2,
            title: "Client-Vector Interface",
            category: "SOFT SKILLS",
            duration: "45M",
            progress: 0,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            participants: 890,
            difficulty: "Standard"
        },
        {
            id: 3,
            title: "Zero-Emission Vectors",
            category: "GREEN MATRIX",
            duration: "1H 30M",
            progress: 100,
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
            participants: 452,
            difficulty: "Specialist"
        }
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32 font-sans overflow-hidden">
            {/* Ambient Animated Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-blue-600/10 -top-[10%] -left-[10%] scale-150 animate-pulse" />
                <div className="blob bg-purple-600/5 bottom-[20%] -right-[10%] scale-150" />
            </div>

            {/* Header / Hero Section */}
            <div className="relative h-96 bg-[#020408] border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_70%)] opacity-50" />
                <div className="absolute inset-0 bg-digital-grid opacity-10 pointer-events-none" />

                <div className="relative z-10 px-8 pt-10 flex flex-col justify-between h-full pb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate(-1)}
                                className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/70 hover:text-white transition-all shadow-2xl"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </motion.button>
                            <div className="flex flex-col">
                                <span className="font-black tracking-[0.4em] text-primary text-[10px] uppercase italic">Operative Enhancement</span>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mt-1">Academy Matrix</h1>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="h-14 w-14 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-primary transition-all">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">New Specialization Available</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none mb-4">Elevate Your Operative Tier</h2>
                        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[80%] leading-relaxed">Unlock exclusive high-budget vectors and tactical badges through certified module synchronization.</p>
                    </div>
                </div>
            </div>

            {/* Path to Pro HUD */}
            <div className="px-8 -mt-10 relative z-20 mb-12">
                <Card className="glass-obsidian border border-primary/20 p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Target className="w-32 h-32 text-primary" />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-xl tracking-tight uppercase">Tier Progression Loop</h3>
                                <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Vector Rank: Alpha 4 (In Sync)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-5xl font-black text-primary tracking-tighter tabular-nums">82%</span>
                            <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mt-1 italic">Synchronization Level</span>
                        </div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '82%' }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-primary shadow-[0_0_20px_rgba(37,99,235,0.6)] rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </motion.div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Sector Lead Certification</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            Up Next: Elite Operative License
                            <Zap className="w-3 h-3 animate-pulse" />
                        </p>
                    </div>
                </Card>
            </div>

            {/* Strategic Modules Section */}
            <div className="px-8 mb-12">
                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                            <PlayCircle className="w-6 h-6 text-primary" />
                            Active Module Feed
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Plumbing', 'Electrical', 'Tech'].map(cat => (
                            <button key={cat} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-8 px-8">
                    {courses.map(course => (
                        <motion.div
                            key={course.id}
                            whileHover={{ y: -10 }}
                            className="min-w-[340px] glass-obsidian border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all group cursor-pointer shadow-2xl"
                        >
                            <div className="h-44 bg-[#0a0f1d] relative overflow-hidden">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 1 }}
                                    src={course.image}
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-3 py-1.5 glass-obsidian border border-primary/40 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest">{course.category}</span>
                                    <span className="px-3 py-1.5 glass-obsidian border border-white/10 rounded-xl text-[9px] font-black text-white/60 uppercase tracking-widest">{course.difficulty}</span>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Globe className="w-3 h-3" />
                                    {course.participants} ONLINE
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="font-black text-white text-xl mb-3 tracking-tight group-hover:text-primary transition-colors uppercase leading-none">{course.title}</h3>
                                <div className="flex items-center gap-4 text-[10px] font-black text-white/30 mb-6 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-primary/60" />
                                        <span>{course.duration} INFUSION</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-emerald-500/60" />
                                        <span>500 XP YIELD</span>
                                    </div>
                                </div>
                                {course.progress > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[9px] font-black text-white/30 uppercase tracking-widest">
                                            <span>SYNCHRONIZING...</span>
                                            <span className="text-primary">{course.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${course.progress}%` }} />
                                        </div>
                                    </div>
                                ) : (
                                    <Button className="w-full h-14 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 border-white/5 text-primary shadow-xl">
                                        Initiate Module
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Specialized Skill Assets */}
            <div className="px-8 grid grid-cols-2 gap-6">
                <Card className="glass-obsidian border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-500/30 transition-all cursor-pointer group hover:bg-purple-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                        <Lock className="w-16 h-16 text-purple-500" />
                    </div>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-2xl">
                        <Award className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Archived Protocols</h4>
                        <span className="text-xs font-black text-white/30 uppercase">My Certificates</span>
                    </div>
                </Card>

                <Card className="glass-obsidian border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-amber-500/30 transition-all cursor-pointer group hover:bg-amber-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                        <Cpu className="w-16 h-16 text-amber-500" />
                    </div>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-2xl">
                        <Star className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Active Augments</h4>
                        <span className="text-xs font-black text-white/30 uppercase">Skill Badges</span>
                    </div>
                </Card>
            </div>

            <style>{`
                .bg-digital-grid {
                    background-image: linear-gradient(to right, #444 1px, transparent 1px),
                                    linear-gradient(to bottom, #444 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}
