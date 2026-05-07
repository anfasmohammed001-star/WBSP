import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

// Dummy Data
const weeklyData = [
    { name: 'Mon', amount: 120 },
    { name: 'Tue', amount: 200 },
    { name: 'Wed', amount: 150 },
    { name: 'Thu', amount: 320 },
    { name: 'Fri', amount: 280 },
    { name: 'Sat', amount: 450 },
    { name: 'Sun', amount: 100 },
];

const monthlyData = [
    { name: 'Week 1', amount: 1200 },
    { name: 'Week 2', amount: 1500 },
    { name: 'Week 3', amount: 1100 },
    { name: 'Week 4', amount: 1800 },
];

const yearlyData = [
    { name: 'Jan', amount: 4500 },
    { name: 'Feb', amount: 5200 },
    { name: 'Mar', amount: 4800 },
    { name: 'Apr', amount: 6100 },
    { name: 'May', amount: 5500 },
    { name: 'Jun', amount: 6700 },
];

export default function WorkerEarnings() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

    const getData = () => {
        switch (timeframe) {
            case 'weekly': return weeklyData;
            case 'monthly': return monthlyData;
            case 'yearly': return yearlyData;
        }
    };

    const getTotal = () => {
        return getData().reduce((acc, curr) => acc + curr.amount, 0);
    };

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
                        <h2 className="text-4xl font-black">${getTotal().toLocaleString()}</h2>
                        <div className="flex items-center mt-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12% from last {timeframe.slice(0, -2)}
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
                            <AreaChart data={getData()}>
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
                        <p className="text-xs text-muted-foreground font-bold uppercase">Avg. Daily</p>
                        <p className="text-xl font-bold mt-1">$145.00</p>
                    </div>
                    <div className="bg-card p-4 rounded-2xl border border-border">
                        <div className="p-2 bg-purple-500/10 w-fit rounded-lg mb-3">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-xs text-muted-foreground font-bold uppercase">Jobs Done</p>
                        <p className="text-xl font-bold mt-1">12</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
