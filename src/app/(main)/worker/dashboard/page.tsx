'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, Clock, MapPin, Bookmark, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboardService';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { jobService } from '@/services/jobService';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Real-time Reactive Query
    const dashboardData = useLiveQuery(async () => {
        if (!user) return {
            stats: { earnings: { month: 0 }, jobsCompleted: 0, rating: 5.0 },
            activeAssignments: [],
            availableJobs: []
        };

        const allJobs = await db.jobs.toArray();

        // 1. Stats Calculation (Mock logic for earnings as we don't have transaction table yet)
        const myCompleted = allJobs.filter(j => j.worker_id === user.id && j.status === 'completed');
        const jobsCompleted = myCompleted.length;
        const earningsMonth = myCompleted.reduce((sum, j) => sum + (j.budget || 0), 0); // Simplified

        // 2. Acitve Assignments (My jobs that are active)
        const activeAssignments = allJobs.filter(j =>
            j.worker_id === user.id && ['assigned', 'in_progress'].includes(j.status)
        );

        // 3. Available Jobs (Open jobs, filtered by skills ideally, for now just open)
        const availableJobs = allJobs.filter(j => j.status === 'open');

        return {
            stats: {
                earnings: { month: earningsMonth },
                jobsCompleted,
                rating: 5.0 // Placeholder or fetch from profile
            },
            activeAssignments,
            availableJobs
        };
    }, [user?.id]);

    const { stats, activeAssignments, availableJobs } = dashboardData || {
        stats: { earnings: { month: 0 }, jobsCompleted: 0, rating: 5.0 },
        activeAssignments: [],
        availableJobs: []
    };

    // Trigger background sync
    useEffect(() => {
        if (user) {
            dashboardService.getWorkerStats(user.id).catch(console.error);
            // Ensure we check for new jobs
            dashboardService.getWorkerActiveJobs(user.id).catch(console.error);
        }
    }, [user]);

    const workerName = user?.fullName || "Worker";
    const [isAccepting, setIsAccepting] = useState<string | null>(null);

    const handleAcceptJob = async (jobId: string) => {
        if (!user || isAccepting) return;
        setIsAccepting(jobId);
        try {
            console.log("WorkerDashboard: Accepting job...", jobId);
            await jobService.assignWorker(jobId, user.id);
            toast.success("Job Accepted! Head to location.");

            // Artificial delay to allow DB propagation if needed, then navigate
            setTimeout(() => {
                navigate(`/worker/job/${jobId}`);
            }, 500);
        } catch (error) {
            console.error("WorkerDashboard: Failed to accept job", error);
            toast.error("Failed to accept job. It might already be taken.");
        } finally {
            setIsAccepting(null);
        }
    };

    return (
        <div className="min-h-screen pb-32 text-foreground relative overflow-hidden bg-[#020408]">
            {/* Ambient Background Effects */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/20 -top-[10%] -right-[10%] scale-150" />
                <div className="blob bg-blue-600/10 bottom-[10%] -left-[10%] scale-150" style={{ animationDelay: '-8s' }} />
                <div className="absolute inset-0 bg-grid opacity-[0.03]" />
            </div>

            {/* Top Bar / Status */}
            <div className="px-6 pt-12 relative z-10 flex justify-between items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-5"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-primary to-purple-600 blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative w-16 h-16 rounded-[1.8rem] bg-glass-obsidian p-[1px] shadow-2xl overflow-hidden border border-white/10">
                            <div className="w-full h-full rounded-[1.7rem] bg-gradient-to-br from-slate-900 to-black flex items-center justify-center font-black text-primary text-2xl group-hover:scale-110 transition-transform duration-500">
                                {workerName.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#020408] animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">On Duty</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">Sec-4 Verified</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight leading-none text-white">
                            {workerName}
                        </h1>
                    </div>
                </motion.div>
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-end"
                    >
                        <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">System Health</span>
                        <span className="text-xs font-black text-emerald-500">OPTIMAL</span>
                    </motion.div>
                </div>
            </div>

            {/* Performance Matrix & Yield Chart */}
            <section className="px-6 mt-10 relative z-10">
                <div className="grid grid-cols-2 gap-5 mb-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="glass-obsidian overflow-hidden border-none relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Wallet className="w-16 h-16 text-primary" />
                            </div>
                            <CardContent className="p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3 block">Total Yield</span>
                                <div className="text-4xl font-black text-white mb-1 tracking-tighter">${stats.earnings.month.toLocaleString()}</div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">+14% Growth</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass-obsidian overflow-hidden border-none relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CheckCircle className="w-16 h-16 text-primary" />
                            </div>
                            <CardContent className="p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3 block">Success Rate</span>
                                <div className="text-4xl font-black text-white mb-1 tracking-tighter">98%</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/60">Top 1% Tier</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Weekly Yield Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="glass-obsidian border border-white/5 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Weekly Metrics</h4>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Reward Distribution Forecast</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-primary">$4,280</div>
                                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Est. Period End</div>
                                </div>
                            </div>

                            {/* Simple CSS Chart */}
                            <div className="flex items-end justify-between h-20 gap-2">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={cn(
                                                "w-full rounded-t-lg transition-all duration-500",
                                                i === 3 ? "bg-primary shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-white/5 group-hover:bg-white/10"
                                            )}
                                        />
                                        <span className="text-[7px] font-black text-white/20 uppercase">D-{6 - i}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>

            {/* Live Operations */}
            <section className="px-6 mt-12 relative z-10">
                <div className="flex justify-between items-center mb-6 px-1">
                    <h3 className="text-xl font-black tracking-tight text-white">Live Operations</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Synchronizing</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {!dashboardData ? (
                        <div className="space-y-4">
                            {[1].map(i => <div key={i} className="h-28 rounded-3xl bg-white/5 animate-pulse border border-white/10" />)}
                        </div>
                    ) : activeAssignments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02] flex flex-col items-center justify-center text-center px-10"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                <Clock className="w-8 h-8 text-white/20" />
                            </div>
                            <h4 className="font-black text-white text-lg mb-2">Zero Active Vectors</h4>
                            <p className="text-white/40 text-xs font-medium max-w-[180px]">Scan the flux network to initiate new mission deployments.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {activeAssignments.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="glass-obsidian group hover:border-primary/30 transition-all duration-500 border border-white/5 overflow-hidden shadow-2xl" onClick={() => navigate(`/worker/job/${job.id}`)}>
                                        <CardContent className="p-0">
                                            <div className="p-6 flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                                    <Bookmark className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">{job.status}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'REAL-TIME'}</span>
                                                    </div>
                                                    <h3 className="font-black text-lg text-white truncate leading-none group-hover:text-primary transition-colors">{job.title}</h3>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Priority</span>
                                                    <div className="flex gap-1">
                                                        <div className="w-3 h-1 rounded-full bg-primary" />
                                                        <div className="w-3 h-1 rounded-full bg-primary" />
                                                        <div className="w-3 h-1 rounded-full bg-white/10" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-1 w-full bg-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '65%' }}
                                                    className="h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Flux Network Feed */}
            <section className="px-6 mt-12 relative z-10">
                <div className="flex justify-between items-end mb-8 px-1">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-white mb-1">Flux Network Feed</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Universal Sector Opportunities</p>
                    </div>
                    <button onClick={() => navigate('/available-work')} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-all border-b border-primary/20 pb-1">Analyze All</button>
                </div>

                <div className="space-y-6">
                    {!dashboardData ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-44 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10" />)}
                        </div>
                    ) : availableJobs.length === 0 ? (
                        <div className="py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center px-10">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                                <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
                            </div>
                            <h4 className="font-black text-white text-xl mb-3 uppercase tracking-tighter">Cooling Cycle Active</h4>
                            <p className="text-white/30 text-xs font-medium uppercase tracking-[0.1em]">No premium spikes detected. Refreshing sector logs...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {availableJobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="glass-obsidian border border-white/10 overflow-hidden relative group hover:-translate-y-2 transition-all duration-500 shadow-3xl">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 rotate-12">
                                            <MapPin className="w-32 h-32 text-primary" />
                                        </div>
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sector Verified</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black tracking-tighter text-white leading-none group-hover:text-primary transition-colors">{job.title}</h3>
                                                    <div className="flex items-center gap-2.5 text-[10px] text-white/40 font-black uppercase tracking-widest">
                                                        <MapPin className="w-3 h-3 text-primary/60" />
                                                        {job.location_address || 'Uncharted Territory'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="text-3xl font-black text-white tracking-tighter mb-1">${job.budget}</div>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Estimated Yield</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-8">
                                                <div className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Complexity</span>
                                                    <span className="text-[10px] font-black text-white/80 uppercase">Advanced Level</span>
                                                </div>
                                                <div className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Duration</span>
                                                    <span className="text-[10px] font-black text-white/80 uppercase">Estimated 2h 45m</span>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleAcceptJob(job.id)}
                                                disabled={!!isAccepting}
                                                variant="premium"
                                                size="xl"
                                                className="w-full relative overflow-hidden group/btn shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                            >
                                                <span className="relative z-10 font-black tracking-[0.15em] text-sm">
                                                    {isAccepting === job.id ? 'SYNCHRONIZING VECTOR...' : 'INITIATE DEPLOYMENT'}
                                                </span>
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                    animate={{ x: ['-100%', '200%'] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                                />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

