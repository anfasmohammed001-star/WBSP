'use client';

import {
    MapPin,
    Calendar,
    Clock,
    Share2,
    ChevronLeft,
    MoreHorizontal,
    CheckCircle2,
    Sparkles,
    Shield,
    Zap,
    TrendingUp,
    Navigation,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkerCard } from '@/components/jobs/WorkerCard';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function JobDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const job = {
        title: 'Emergency Pipe Burst Transmission',
        category: 'PLUMBING SECTOR',
        status: 'IDENTIFYING OPTIMAL VECTOR',
        description: 'Critical water leakage in Sector 4 (Kitchen). Thermal valve unresponsive. Requires immediate isolation and hydraulic restorative measures.',
        location: '123 Maple Ave, Springfield Matrix',
        date: '27 OCT 2026',
        time: '14:00 Zulu',
        budget: 150.00,
        customer: 'Alex Johnson',
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
    };

    const recommendedWorkers = [
        {
            id: 'w1',
            name: 'Alexander Sterling',
            rating: 4.9,
            jobsCompleted: 128,
            skills: ['Hydraulic Matrix', 'Flux Jointing', 'System Isolation'],
            distance: '0.8 Sectors',
            hourlyRate: 85,
            matchScore: 98,
            avatarUrl: 'https://i.pravatar.cc/150?u=alexander',
            isVerified: true
        }
    ];

    return (
        <div className="bg-[#020408] min-h-screen pb-40 relative text-white selection:bg-primary selection:text-white">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-purple-600/5 bottom-[20%] -right-[10%] scale-150" />
            </div>

            {/* Hero Section */}
            <div className="relative h-96 w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={job.image}
                    alt={job.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

                {/* Header Controls */}
                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
                    <motion.button
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-all shadow-2xl"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </motion.button>
                    <div className="flex gap-4">
                        <button className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-all">
                            <Share2 className="h-6 w-6" />
                        </button>
                        <button className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-all">
                            <MoreHorizontal className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-12 left-8 right-8 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">{job.category}</span>
                    </motion.div>

                    <div className="flex justify-between items-end gap-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tighter leading-none"
                        >
                            {job.title}
                        </motion.h1>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-right"
                        >
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Budget Allocation</span>
                            <div className="text-5xl font-black tracking-tighter text-white">${job.budget.toFixed(0)}</div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="px-8 -mt-6 relative z-10 space-y-10">
                {/* AI Matrix Progress */}
                <Card className="glass-obsidian p-8 border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                        <Activity className="w-24 h-24 text-primary" />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/80">AI Vector Synthesis</span>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.status}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 h-2 mb-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-primary rounded-full origin-left h-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            />
                        ))}
                        <div className="bg-white/5 rounded-full h-full" />
                        <div className="bg-white/5 rounded-full h-full" />
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Syncing with available high-tier operatives...</p>
                </Card>

                {/* Technical Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Sync Date', value: job.date, icon: Calendar },
                        { label: 'Matrix Time', value: job.time, icon: Clock },
                        { label: 'Tactical Loc', value: 'Sector 4-B', icon: MapPin },
                        { label: 'Proximity', value: '0.8 Units', icon: Navigation },
                    ].map((item) => (
                        <Card key={item.label} className="glass-obsidian p-6 border-white/5 flex flex-col gap-4 group hover:border-primary/20 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                <p className="text-sm font-black text-white tracking-tight">{item.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Narrative Detail */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <h3 className="text-xl font-black tracking-tighter uppercase">Mission Briefing</h3>
                    </div>
                    <Card className="glass-obsidian p-8 border-white/5 relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-20 h-20 text-white" />
                        </div>
                        <p className="text-lg font-medium text-white/60 leading-relaxed italic">
                            "{job.description}"
                        </p>
                    </Card>
                </div>

                {/* Primary Intelligence Recommendation */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-black tracking-tighter uppercase">Alpha Selection</h3>
                        </div>
                        <div className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/10">98% Capability Match</div>
                    </div>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="cursor-pointer"
                        onClick={() => navigate(`/worker/profile/${recommendedWorkers[0].id}`)}
                    >
                        <WorkerCard {...recommendedWorkers[0]} />
                    </motion.div>
                </div>
            </div>

            {/* Tactical Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-8 glass-obsidian border-t border-white/10 z-[100] flex justify-center">
                <div className="w-full max-w-4xl flex gap-6">
                    <Button
                        variant="outline"
                        className="flex-1 h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] border-2 border-white/5 hover:bg-white/5 transition-all"
                    >
                        Abort Mission
                    </Button>
                    <Button
                        variant="premium"
                        className="flex-1 h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30"
                        onClick={() => navigate(`/tracking/${id || 'demo-vector'}`)}
                    >
                        Initiate Deployment
                    </Button>
                </div>
            </div>
        </div>
    );
}
