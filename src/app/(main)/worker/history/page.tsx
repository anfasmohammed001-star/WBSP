'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    ChevronLeft,
    Calendar,
    Clock,
    CheckCircle,
    ChevronRight,
    DollarSign,
    Search,
    Filter,
    ArrowUpRight,
    Star,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function WorkerJobHistoryPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const history = await jobService.getWorkerJobHistory(user.id);
                setJobs(history || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load history");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            if (activeTab === 'all') return true;
            if (activeTab === 'completed') return job.status === 'completed';
            if (activeTab === 'pending') return ['assigned', 'in_progress'].includes(job.status);
            return true;
        });
    }, [jobs, activeTab]);

    const stats = useMemo(() => {
        const completed = jobs.filter(j => j.status === 'completed');
        return {
            totalEarned: completed.reduce((sum, j) => sum + (Number(j.budget) || 0), 0),
            completedCount: completed.length,
            pendingCount: jobs.filter(j => ['assigned', 'in_progress'].includes(j.status)).length
        };
    }, [jobs]);

    // Prepare chart data (last 7 completed jobs earnings)
    const chartData = useMemo(() => {
        return jobs
            .filter(j => j.status === 'completed')
            .slice(0, 7)
            .reverse()
            .map((j, i) => ({
                name: `Job ${i + 1}`,
                amount: Number(j.budget)
            }));
    }, [jobs]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 animate-pulse mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Clock className="h-8 w-8 text-primary animate-spin-slow" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-black">Syncing History</h2>
                        <p className="text-muted-foreground text-sm font-medium">Retrieving your career milestones...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 dark">
            {/* Premium Header */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/80 border border-border/50 transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Job History</h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Performance Hub</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Live Sync</span>
                    </div>
                </div>

                {/* Tab Switcher - Visual refinement */}
                <div className="px-6 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
                    {['all', 'completed', 'pending'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeTab === tab
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/50"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 pt-6 space-y-6">
                {/* Stats & Analytics Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="bg-secondary/20 border-border/50 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-6 grid grid-cols-3 gap-4 border-b border-border/30">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Earnings</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-green-500">${stats.totalEarned.toFixed(0)}</span>
                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-1 border-x border-border/30 px-4">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Revenue</p>
                                    <span className="text-xl font-black text-primary">{stats.completedCount}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Active</p>
                                    <span className="text-xl font-black text-amber-500">{stats.pendingCount}</span>
                                </div>
                            </div>

                            {/* Earnings Mini Chart */}
                            {chartData.length > 1 && (
                                <div className="h-24 w-full pt-4 pr-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorAmount)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Job List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Recent Activity</h2>
                        <Filter className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>

                    <AnimatePresence mode="popLayout">
                        {filteredJobs.length > 0 ? filteredJobs.map((job, index) => {
                            const customerReview = job.reviews?.find((r: any) => r.reviewer_id === job.customer_id);

                            return (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card
                                        className="overflow-hidden border-border/50 hover:border-primary/30 transition-all cursor-pointer group shadow-sm active:scale-[0.98] bg-secondary/10"
                                        onClick={() => navigate(`/worker/job/${job.id}`)}
                                    >
                                        <CardContent className="p-0">
                                            <div className="p-5 space-y-4">
                                                {/* Top Row */}
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                                                job.status === 'completed'
                                                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                            )}>
                                                                {job.status.replace('_', ' ')}
                                                            </div>
                                                            {customerReview && (
                                                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                                                                    <Star className="h-2.5 w-2.5 fill-yellow-500" />
                                                                    <span className="text-[8px] font-black">{customerReview.rating}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-foreground">${job.budget}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(job.updated_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        <span>{job.category}</span>
                                                    </div>
                                                </div>

                                                {/* Footer: Customer & Action */}
                                                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full border border-border/50 overflow-hidden bg-secondary/50">
                                                            <img
                                                                src={job.customer?.profile_image_url || `https://ui-avatars.com/api/?name=${job.customer?.full_name || 'Customer'}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Customer</p>
                                                            <p className="text-xs font-bold text-foreground">{job.customer?.full_name || 'Private Client'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar (Visible for active jobs) */}
                                            {job.status === 'in_progress' && (
                                                <div className="h-1 bg-amber-500/10 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-amber-500"
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                        style={{ width: '50%' }}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        }) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-secondary/5 rounded-3xl border border-dashed border-border/50"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                                        <Briefcase className="h-10 w-10 text-primary/20" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-background border border-border/50 p-2 rounded-xl">
                                        <Search className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2 px-6">
                                    <h3 className="text-lg font-black tracking-tight">No milestones yet</h3>
                                    <p className="text-muted-foreground text-sm font-medium">Your completed and active jobs will appear here as you grow your career.</p>
                                </div>
                                <Button
                                    onClick={() => navigate('/worker/dashboard')}
                                    className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                                >
                                    Find Your First Job
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
            `}</style>
        </div>
    );
}

