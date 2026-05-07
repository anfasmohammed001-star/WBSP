'use client';

import React from 'react';
import {
    ChevronLeft,
    MoreHorizontal,
    CheckCircle,
    TrendingUp,
    Star,
    Calendar,
    Plus,
    FileText,
    Shield,
    Sparkles,
    Zap,
    Users,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function CustomerProfilePage() {
    const navigate = useNavigate();

    const activeJobs = [
        {
            id: 1,
            title: 'Full-Stack System Migration',
            status: 'IN PROGRESS',
            date: 'Due in 4 days',
            progress: 65,
            image: 'https://images.unsplash.com/photo-1558441366-4f40445d8b8b?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 2,
            title: 'Cloud Infrastructure Audit',
            status: 'AUDITING',
            date: 'Started today',
            progress: 25,
            image: 'https://images.unsplash.com/photo-1558494949-0d35069a794c?auto=format&fit=crop&q=80&w=300'
        }
    ];

    const recentCompletions = [
        {
            id: 1,
            title: 'Mobile App Redesign',
            date: 'Completed June 12, 2023',
            rating: 5.0,
            icon: Sparkles,
            color: 'text-indigo-400'
        },
        {
            id: 2,
            title: 'Security Patch Deployment',
            date: 'Completed May 28, 2023',
            rating: 4.8,
            icon: Shield,
            color: 'text-blue-400'
        }
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-purple-600/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-primary/10 bottom-[10%] -right-[10%] scale-150" />
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
                        <h1 className="text-xl font-black tracking-tighter">Profile Terminal</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Client ID: #8821-X</p>
                    </div>
                </div>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white/70" />
                </button>
            </header>

            <main className="p-6 relative z-10">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-[2.5rem] border-2 border-primary/20 p-1 bg-glass-obsidian shadow-2xl relative overflow-hidden group">
                            <img src="https://ui-avatars.com/api/?name=Alexander+Sterling&size=200&background=020408&color=fff" alt="Profile" className="w-full h-full rounded-[2.3rem] object-cover" />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Activity className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-xl p-2 border-4 border-[#020408] shadow-lg shadow-emerald-500/20 text-white">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter text-white mb-2">Alexander Sterling</h2>
                    <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Zap className="w-3 h-3 text-primary" />
                        <span>San Francisco Sector</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Matrix Tier 5</span>
                    </div>

                    <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-lg shadow-primary/10">
                        Verified Client Matrix
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <Card className="glass-obsidian border-white/5 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <FileText className="w-16 h-16 text-primary" />
                        </div>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">Total Deployments</p>
                        <h3 className="text-4xl font-black text-white mb-1 tracking-tighter">128</h3>
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3" />
                            <span>+12% Yield</span>
                        </div>
                    </Card>

                    <Card className="glass-obsidian border-white/5 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Star className="w-16 h-16 text-primary" />
                        </div>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">Matrix Rating</p>
                        <div className="flex items-center gap-2 text-4xl font-black text-white mb-1 tracking-tighter">
                            4.9
                            <Star className="w-6 h-6 text-primary fill-primary mb-1" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <span>Sector Lead</span>
                        </div>
                    </Card>
                </div>

                {/* Active Jobs */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-xl font-black tracking-tighter">Active Missions</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">Full Tactical View</button>
                    </div>

                    <div className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 no-scrollbar">
                        {activeJobs.map(job => (
                            <motion.div
                                key={job.id}
                                whileHover={{ y: -5 }}
                                className="min-w-[300px] glass-obsidian p-5 rounded-[2rem] border border-white/5 shadow-2xl"
                            >
                                <div className="relative h-36 rounded-2xl overflow-hidden mb-5">
                                    <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 left-3 glass-obsidian border border-white/20 px-3 py-1.5 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.1em]">
                                        {job.status}
                                    </div>
                                </div>
                                <h4 className="font-black text-white text-lg mb-3 tracking-tight truncate">{job.title}</h4>
                                <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                    {job.date}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/20">Sync Progress</span>
                                        <span className="text-primary">{job.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: `${job.progress}%` }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        onClick={() => navigate('/post-job')}
                        className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 group mt-4"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Initiate New Vector
                    </Button>
                </div>

                {/* Recent Completions */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <h3 className="text-xl font-black tracking-tighter">Archived Success</h3>
                    </div>
                    <div className="space-y-4">
                        {recentCompletions.map(job => (
                            <motion.div
                                key={job.id}
                                whileHover={{ x: 5 }}
                                className="glass-obsidian p-5 rounded-2xl border border-white/5 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <job.icon className={cn("w-6 h-6", job.color)} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-base mb-1 tracking-tight group-hover:text-primary transition-colors">{job.title}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{job.date}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                                        <Star className="w-4 h-4 fill-primary" />
                                        {job.rating}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Vector Verified</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
