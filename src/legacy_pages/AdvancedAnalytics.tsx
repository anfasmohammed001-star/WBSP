import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, BarChart2, PieChart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function AdvancedAnalytics() {
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Deep Dive</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Year over Year */}
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Your Growth</h2>
                        <div className="flex space-x-2 text-xs font-bold bg-secondary p-1 rounded-lg">
                            <button className="px-3 py-1 bg-white shadow-sm rounded-md text-primary">YoY</button>
                            <button className="px-3 py-1 text-muted-foreground">MoM</button>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-40 w-full px-2 space-x-2">
                        {[40, 65, 50, 80, 70, 95].map((h, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className={cn("w-full rounded-t-lg transition-all group-hover:opacity-80", i === 5 ? "bg-primary" : "bg-primary/20")}
                                />
                                <span className="text-[10px] font-bold text-muted-foreground mt-2">{['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center space-x-2 text-green-600 font-bold bg-green-500/10 p-3 rounded-xl">
                        <ArrowUp className="h-4 w-4" />
                        <span>Earnings up 24% vs last year</span>
                    </div>
                </div>

                {/* Benchmark */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                        <Users className="h-6 w-6 text-blue-400" />
                        <div>
                            <h2 className="font-black text-lg">Market Benchmark</h2>
                            <p className="text-xs text-gray-400">Comparing you to other Electricians in NYC</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-1">
                                <span>Hourly Rate</span>
                                <span className="text-green-400">Top 15%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                                <div className="absolute left-[70%] top-0 bottom-0 w-1 bg-white z-10" /> {/* Market Avg */}
                                <div className="h-full bg-blue-500 rounded-full w-[85%]" />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                <span>$40</span>
                                <span>Avg: $75</span>
                                <span>$120</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold mb-1">
                                <span>Job Completion Time</span>
                                <span className="text-yellow-400">Avg</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                                <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-white z-10" />
                                <div className="h-full bg-yellow-500 rounded-full w-[50%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Retention */}
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg mb-1">Repeat Clients</h2>
                        <p className="text-xs text-muted-foreground max-w-[150px]">35% of your clients booked you more than once.</p>
                    </div>
                    <div className="h-20 w-20 relative">
                        <PieChart className="h-full w-full text-primary" />
                    </div>
                </div>

            </div>
        </div>
    );
}
