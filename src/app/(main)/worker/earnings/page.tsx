'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval, isSameWeek, startOfYear, eachMonthOfInterval, isSameMonth } from 'date-fns';

export default function WorkerEarnings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchEarnings = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('budget, created_at')
                    .eq('worker_id', user.id)
                    .eq('status', 'completed')
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setJobs(data || []);
            } catch (err) {
                console.error("Error fetching earnings:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarnings();
    }, [user]);

    const chartData = useMemo(() => {
        const now = new Date();

        if (timeframe === 'weekly') {
            const start = startOfWeek(now, { weekStartsOn: 1 });
            const end = endOfWeek(now, { weekStartsOn: 1 });
            const days = eachDayOfInterval({ start, end });

            return days.map(day => {
                const amount = jobs
                    .filter(j => isSameDay(new Date(j.created_at), day))
                    .reduce((sum, j) => sum + (Number(j.budget) || 0), 0);
                return { name: format(day, 'EEE'), amount };
            });
        }

        if (timeframe === 'monthly') {
            const start = startOfMonth(now);
            const end = endOfMonth(now);
            const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

            return weeks.map((week, i) => {
                const amount = jobs
                    .filter(j => isSameWeek(new Date(j.created_at), week, { weekStartsOn: 1 }))
                    .reduce((sum, j) => sum + (Number(j.budget) || 0), 0);
                return { name: `Week ${i + 1}`, amount };
            });
        }

        if (timeframe === 'yearly') {
            const start = startOfYear(now);
            const months = eachMonthOfInterval({ start, end: now });

            return months.map(month => {
                const amount = jobs
                    .filter(j => isSameMonth(new Date(j.created_at), month))
                    .reduce((sum, j) => sum + (Number(j.budget) || 0), 0);
                return { name: format(month, 'MMM'), amount };
            });
        }

        return [];
    }, [jobs, timeframe]);

    const totalEarnings = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [chartData]);

    const avgDaily = useMemo(() => {
        if (chartData.length === 0) return 0;
        return totalEarnings / chartData.length;
    }, [totalEarnings, chartData]);

    const jobsDone = useMemo(() => {
        const now = new Date();
        if (timeframe === 'weekly') {
            return jobs.filter(j => isSameWeek(new Date(j.created_at), now, { weekStartsOn: 1 })).length;
        }
        if (timeframe === 'monthly') {
            return jobs.filter(j => isSameMonth(new Date(j.created_at), now)).length;
        }
        return jobs.length; // Yearly or total
    }, [jobs, timeframe]);

    if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading Analytics...</div>;

    return (
        <div className="bg-background min-h-screen text-foreground pb-10">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <h1 className="text-lg font-bold">Earnings Analytics</h1>
                <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                </button>
            </header>

            <div className="p-4 space-y-6">
                {/* Total Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium opacity-80 mb-1">Total Earnings ({timeframe})</p>
                        <h2 className="text-4xl font-black">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                        <div className="flex items-center mt-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Recent activity tracked
                        </div>
                    </div>
                </motion.div>

                {/* Timeframe Toggle */}
                <div className="bg-secondary p-1 rounded-xl flex">
                    {['weekly', 'monthly', 'yearly'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t as any)}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${timeframe === t
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Main Chart */}
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Earnings Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Earnings']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card p-4 rounded-2xl border border-border">
                        <div className="p-2 bg-green-500/10 w-fit rounded-lg mb-3">
                            <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground font-bold uppercase">Avg. {timeframe === 'weekly' ? 'Daily' : timeframe === 'monthly' ? 'Weekly' : 'Monthly'}</p>
                        <p className="text-xl font-bold mt-1">${avgDaily.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-card p-4 rounded-2xl border border-border">
                        <div className="p-2 bg-purple-500/10 w-fit rounded-lg mb-3">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-xs text-muted-foreground font-bold uppercase">Jobs Done</p>
                        <p className="text-xl font-bold mt-1">{jobsDone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

