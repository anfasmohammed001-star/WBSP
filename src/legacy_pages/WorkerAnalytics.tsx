import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, DollarSign, Star, Users, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WorkerAnalytics() {
    const navigate = useNavigate();

    // Mock Data for Weekly Earnings
    const weeklyEarnings = [40, 65, 30, 85, 50, 95, 60];
    const maxEarning = Math.max(...weeklyEarnings);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-black">Performance</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">
                {/* Main Stats Card */}
                <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-primary-foreground/70 font-bold text-xs uppercase tracking-wider">Total Earnings (Jan)</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-4xl font-black">$2,845</span>
                            <span className="text-sm font-bold opacity-80">.00</span>
                        </div>
                        <div className="mt-4 flex items-center space-x-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12.5% vs last month</span>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>

                {/* Earnings Chart (CSS Bar Chart) */}
                <div className="bg-card border border-border rounded-3xl p-6">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="font-bold text-lg">Weekly Trend</h3>
                        <select className="bg-secondary rounded-lg px-2 py-1 text-xs font-bold border-none outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="flex items-end justify-between h-40 space-x-2">
                        {weeklyEarnings.map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/40 transition-colors"
                                    style={{ height: `${(value / maxEarning) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${value * 10}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground mt-2">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                                <Star className="h-5 w-5 fill-yellow-500" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-green-500">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> 0.2
                            </span>
                        </div>
                        <div className="text-2xl font-black">4.9</div>
                        <div className="text-xs font-bold text-muted-foreground">Rating</div>
                    </div>

                    <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                <Eye className="h-5 w-5" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-green-500">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> 15%
                            </span>
                        </div>
                        <div className="text-2xl font-black">1.2k</div>
                        <div className="text-xs font-bold text-muted-foreground">Profile Views</div>
                    </div>

                    <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-green-500/10 rounded-xl text-green-500">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-red-500">
                                <ArrowDownRight className="h-3 w-3 mr-1" /> 2%
                            </span>
                        </div>
                        <div className="text-2xl font-black">85%</div>
                        <div className="text-xs font-bold text-muted-foreground">Conversion</div>
                    </div>

                    <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-green-500">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> $5
                            </span>
                        </div>
                        <div className="text-2xl font-black">$45</div>
                        <div className="text-xs font-bold text-muted-foreground">Avg. Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
