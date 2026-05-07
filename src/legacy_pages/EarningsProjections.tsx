import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Calendar, AlertCircle, ArrowRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function EarningsProjections() {
    const navigate = useNavigate();
    const [targetAmount, setTargetAmount] = useState(5000);
    const [timeframe, setTimeframe] = useState('Monthly');

    const AVG_JOB_PRICE = 145;
    const jobsRequired = Math.ceil(targetAmount / AVG_JOB_PRICE);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-black">Forecast</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-6 space-y-8">
                {/* Main Projection */}
                <div className="text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Projected Monthly Income</p>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        $4,250
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-2 text-sm font-medium text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>On track to beat last month</span>
                    </div>
                </div>

                {/* Graph Visualization Mockup */}
                <div className="h-48 flex items-end justify-between px-2 space-x-2">
                    {[30, 45, 60, 50, 75, 80, 65, 90, 85, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group">
                            <div
                                className={cn(
                                    "w-full rounded-t-lg transition-all duration-500",
                                    i > 6 ? "bg-primary/30 border-t-2 border-dashed border-primary" : "bg-primary"
                                )}
                                style={{ height: `${h}%` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Week 1</span>
                    <span>Today</span>
                    <span>Week 4 (Est)</span>
                </div>

                {/* Breakdown */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                    <h3 className="font-bold mb-4">Income Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 p-2 rounded-lg text-green-600">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">Secured Jobs</span>
                            </div>
                            <span className="font-bold">$2,100</span>
                        </div>
                        <div className="flex justify-between items-center opacity-70">
                            <div className="flex items-center space-x-3">
                                <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-600">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">Potential (Pending)</span>
                            </div>
                            <span className="font-bold">$850</span>
                        </div>
                        <div className="flex justify-between items-center opacity-50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-600">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">Predicted Growth</span>
                            </div>
                            <span className="font-bold">$1,300</span>
                        </div>
                    </div>
                </div>

                {/* Goal Setter */}
                {/* Goal Setter Calculator */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-lg">Income Calculator</h3>
                        <Activity className="h-5 w-5 opacity-80" />
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-80">I want to earn</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold opacity-80">$</span>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-white/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-80">Timeframe</label>
                            <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                                {['Weekly', 'Monthly'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={cn(
                                            "py-2 text-sm font-bold rounded-lg transition-all",
                                            timeframe === t ? "bg-white text-indigo-600 shadow-md" : "text-white/60 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium opacity-80">Jobs Required</span>
                                <span className="text-2xl font-black">{jobsRequired}</span>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium opacity-80">Avg. Earnings/Job</span>
                                <span className="text-lg font-bold text-green-300">${AVG_JOB_PRICE}</span>
                            </div>
                        </div>

                        <p className="text-xs font-medium opacity-75 text-center px-4">
                            Based on your historical average of ${AVG_JOB_PRICE}/job.
                        </p>

                        <button onClick={() => navigate('/jobs')} className="w-full bg-white text-indigo-600 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/90 transition-colors shadow-lg active:scale-95 duration-200">
                            <span>Find {jobsRequired} Jobs Now</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
