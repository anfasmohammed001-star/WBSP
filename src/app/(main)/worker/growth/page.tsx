'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, BarChart2, PieChart, Users, ArrowUp, DollarSign, Calendar, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { careerCoachService, CareerAdvice } from '@/services/careerCoachService';
import { toast } from 'react-hot-toast';
import { Loader2, Sparkles, Lightbulb, TrendingUp as TrendUpIcon } from 'lucide-react';

export default function GrowthPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'financial'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        jobSuccessScore: 0,
        returnClientRate: 0,
        hourlyRate: 0,
        completedJobsCount: 0
    });
    const [careerAdvice, setCareerAdvice] = useState<CareerAdvice | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const getAdvice = async () => {
        setIsThinking(true);
        try {
            // Get skills from some profile or default
            const skills = ["General Labor"];
            const advice = await careerCoachService.getGrowthAdvice(skills, "Local Area");
            setCareerAdvice(advice);
            toast.success("AI Coach analyzed your profile");
        } catch (err) {
            toast.error("Advice engine busy");
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // 1. Fetch Worker Profile
                let hourlyRate = 0;
                const { data: profile } = await supabase
                    .from('worker_profiles')
                    .select('hourly_rate')
                    .eq('user_id', user.id)
                    .single();

                if (profile) hourlyRate = Number(profile.hourly_rate) || 0;

                // 2. Fetch Completed Jobs history (Sync first if possible, or just read local/remote)
                // We try remote first for accurate analytics
                const { data: jobs, error } = await supabase
                    .from('jobs')
                    .select('id, budget, created_at, customer_id, status')
                    .eq('worker_id', user.id)
                    .order('created_at', { ascending: true }); // Oldest first for chart

                if (error) throw error;

                const completedJobs = jobs?.filter(j => j.status === 'completed') || [];
                const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.budget || 0), 0);

                // Job Success Score (Completed vs Total Assigned/In-Progress/Completed)
                // If status is 'canceled', we count it against. If 'open', irrelevant.
                const handledJobs = jobs?.filter(j => ['completed', 'assigned', 'in_progress'].includes(j.status)) || [];
                const jobSuccessScore = handledJobs.length > 0
                    ? Math.round((completedJobs.length / handledJobs.length) * 100)
                    : 100; // Default to 100 if no history

                // 3. Process Chart Data (Monthly)
                const monthlyMap = new Map<string, number>();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                // Initialize last 6 months 
                const today = new Date();
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const key = `${months[d.getMonth()]}`;
                    monthlyMap.set(key, 0);
                }

                completedJobs.forEach(job => {
                    if (job.created_at) {
                        const date = new Date(job.created_at);
                        const key = months[date.getMonth()];
                        if (monthlyMap.has(key)) {
                            monthlyMap.set(key, (monthlyMap.get(key) || 0) + (job.budget || 0));
                        }
                    }
                });

                // Convert map to array for UI
                const finalChartData = Array.from(monthlyMap.entries()).map(([label, value]) => {
                    // Normalize height for UI bars (0 - 100%)
                    // Find max value first?
                    return { label, value };
                });

                // Calculate percentages relative to max for UI bars
                const maxVal = Math.max(...finalChartData.map(d => d.value), 100); // Avoid div by zero
                const uiChartData = finalChartData.map(d => ({
                    ...d,
                    heightPct: Math.round((d.value / maxVal) * 100)
                }));

                setStats({
                    totalEarnings,
                    jobSuccessScore,
                    returnClientRate: 0, // Need more complex logic for this
                    hourlyRate,
                    completedJobsCount: completedJobs.length
                });

                setChartData(uiChartData);

            } catch (err) {
                console.error("Error loading growth data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Data...</div>;

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Growth & Insights</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Tabs */}
                <div className="bg-secondary/50 p-1 rounded-2xl flex font-bold text-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={cn("flex-1 py-3 rounded-xl transition-all", activeTab === 'overview' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setActiveTab('financial')}
                        className={cn("flex-1 py-3 rounded-xl transition-all", activeTab === 'financial' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                    >
                        Financials
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* AI Career Path Coach */}
                        <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-lg text-indigo-100">AI Career Coach</h2>
                                        <p className="text-[10px] font-bold uppercase text-indigo-400">Personalized upskilling roadmap</p>
                                    </div>
                                </div>
                                {!careerAdvice && (
                                    <Button
                                        onClick={getAdvice}
                                        disabled={isThinking}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-4 text-xs font-black shadow-lg shadow-indigo-500/20"
                                    >
                                        {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "ANALYZE PATH"}
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence>
                                {careerAdvice && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4 pt-2"
                                    >
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Recommended path</p>
                                            <h3 className="text-xl font-black text-white leading-tight">{careerAdvice.recommendedPath}</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                                                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Potential</p>
                                                <p className="text-lg font-black text-white">{careerAdvice.earningPotential}</p>
                                            </div>
                                            <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                                                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Market Insight</p>
                                                <p className="text-[10px] font-medium text-slate-300 leading-tight">{careerAdvice.marketInsight}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase px-2">Next Steps</p>
                                            {careerAdvice.nextSteps.map((step, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-xs font-medium text-slate-300">
                                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                                    {step}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCareerAdvice(null)}
                                            className="w-full text-center text-[10px] font-bold text-slate-600 uppercase pt-2 hover:text-slate-400"
                                        >
                                            Reset Analysis
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Monthly Earnings Chart */}
                        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg">Monthly Earnings</h2>
                                <div className="flex space-x-2 text-xs font-bold bg-secondary p-1 rounded-lg">
                                    <span className="px-3 py-1 bg-white shadow-sm rounded-md text-primary cursor-default">Recent</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between h-40 w-full px-2 space-x-2">
                                {chartData.length > 0 ? chartData.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full h-full flex items-end">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${d.heightPct}%` }}
                                                transition={{ delay: i * 0.1 }}
                                                className={cn("w-full rounded-t-lg transition-all group-hover:opacity-80", i === chartData.length - 1 ? "bg-primary" : "bg-primary/20")}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground mt-2">{d.label}</span>
                                    </div>
                                )) : <div className="w-full text-center text-muted-foreground text-sm">No recent earnings data</div>}
                            </div>

                            <div className="mt-4 flex items-center justify-center space-x-2 text-green-600 font-bold bg-green-500/10 p-3 rounded-xl">
                                <ArrowUp className="h-4 w-4" />
                                <span>Total: ${stats.totalEarnings.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Market Benchmark */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <Users className="h-6 w-6 text-blue-400" />
                                <div>
                                    <h2 className="font-black text-lg">Profile Stats</h2>
                                    <p className="text-xs text-gray-400">Your visibility on the platform</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span>Hourly Rate: ${stats.hourlyRate}/hr</span>
                                        <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Active</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                                        <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-white z-10" />
                                        {/* Assuming $100 is max for bar visualization */}
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(stats.hourlyRate, 100)}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span>Jobs Completed</span>
                                        <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{stats.completedJobsCount} Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Retention */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border border-border p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-32">
                                <PieChart className="h-6 w-6 text-orange-500" />
                                <div>
                                    <div className="text-2xl font-black">{stats.returnClientRate}%</div>
                                    <div className="text-xs text-muted-foreground font-bold leading-tight">Return Client Rate</div>
                                </div>
                            </div>
                            <div className="bg-card border border-border p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-32">
                                <Target className="h-6 w-6 text-purple-500" />
                                <div>
                                    <div className="text-2xl font-black">{stats.jobSuccessScore}%</div>
                                    <div className="text-xs text-muted-foreground font-bold leading-tight">Job Success Score</div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}

                {activeTab === 'financial' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                        {/* Total Spend/Earnings Context */}
                        <div className="bg-primary/5 rounded-3xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold opacity-70 mb-1">Total Earnings (All Time)</p>
                                <h2 className="text-3xl font-black text-primary">${stats.totalEarnings.toFixed(2)}</h2>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                        </div>

                        {/* Note about Expenses */}
                        <div className="bg-secondary/30 rounded-3xl p-6 border border-dashed border-border text-center">
                            <p className="text-sm text-muted-foreground">Expense tracking features are coming soon. Currently showing total job revenue.</p>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

