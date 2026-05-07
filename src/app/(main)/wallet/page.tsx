

import {
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    Download,
    ChevronLeft,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

import { useNavigate } from 'react-router-dom';

const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
];

export default function Wallet() {
    const navigate = useNavigate();

    const transactions = [
        { id: '1', title: 'Luxury Penthouse Staging', date: 'June 18, 2023', amount: 450.00, type: 'in', category: 'Job Payment' },
        { id: '2', title: 'Platform Service Fee', date: 'June 18, 2023', amount: -12.50, type: 'out', category: 'Service Fee' },
        { id: '3', title: 'Full-Stack Migration', date: 'June 17, 2023', amount: 1200.00, type: 'in', category: 'Job Payment' },
        { id: '4', title: 'Withdrawal to Bank', date: 'June 16, 2023', amount: -500.00, type: 'out', category: 'Transfer' },
    ];

    return (
        <div className="bg-background min-h-screen pb-24 transition-colors duration-300 text-foreground max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            {/* Header */}
            <div className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-2xl bg-card border border-border shadow-sm hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <h1 className="text-xl font-black text-foreground">My Wallet</h1>
                <button className="p-2.5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <div className="px-6 space-y-8">
                {/* Balance Card (Image 19) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative h-56 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/30 group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
                    {/* Glass Overlay Elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-20%] w-40 h-40 bg-black/20 rounded-full blur-2xl" />

                    <div className="relative h-full p-8 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase">Current Balance</p>
                                <h2 className="text-4xl font-black tracking-tighter">$2,450.80</h2>
                            </div>
                            <div className="h-10 w-14 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                                <div className="grid grid-cols-2 gap-1 px-2 opacity-60">
                                    <div className="h-2 w-3 bg-white rounded-sm" />
                                    <div className="h-2 w-3 bg-white rounded-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="space-y-4">
                                <div className="flex space-x-1.5 opacity-60">
                                    <span className="text-sm font-bold tracking-widest">####</span>
                                    <span className="text-sm font-bold tracking-widest">####</span>
                                    <span className="text-sm font-bold tracking-widest">####</span>
                                    <span className="text-sm font-bold tracking-widest">8821</span>
                                </div>
                                <div className="flex space-x-8">
                                    <div>
                                        <p className="text-[8px] font-black tracking-widest opacity-60 uppercase mb-0.5">Card Holder</p>
                                        <p className="text-xs font-bold uppercase tracking-widest">Alexander Sterling</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black tracking-widest opacity-60 uppercase mb-0.5">Expires</p>
                                        <p className="text-xs font-bold tracking-widest uppercase">08/26</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex -space-x-3 mb-1">
                                <div className="h-10 w-10 rounded-full bg-red-500/80 mix-blend-screen" />
                                <div className="h-10 w-10 rounded-full bg-yellow-400/80 mix-blend-screen" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="flex justify-around px-2">
                    {[
                        { label: 'Send', icon: ArrowUpRight, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                        { label: 'Receive', icon: ArrowDownLeft, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
                        { label: 'Exchange', icon: RefreshCcw, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
                        { label: 'Withdraw', icon: Download, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
                    ].map((action) => (
                        <div key={action.label} className="flex flex-col items-center space-y-2">
                            <button className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shadow-sm border border-transparent hover:border-border", action.color)}>
                                <action.icon className="h-6 w-6" />
                            </button>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{action.label}</span>
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="bg-card p-6 rounded-[2.5rem] border border-border space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black tracking-tight text-foreground">Total Transaction</h3>
                            <div className="flex items-center text-green-500 text-xs font-bold">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +14.2% from last week
                            </div>
                        </div>
                        <select className="bg-secondary border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 text-muted-foreground outline-none cursor-pointer hover:bg-secondary/80">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>

                    <div className="h-48 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 3 ? '#2563EB' : '#DBEafe'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-lg font-black tracking-tight text-foreground">Recent Activity</h3>
                        <button className="text-xs font-black text-primary uppercase tracking-widest hover:text-primary/80">See All</button>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="bg-card p-4 rounded-3xl border border-border flex items-center space-x-4 hover:border-primary/20 transition-colors">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center",
                                    tx.type === 'in' ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                                )}>
                                    {tx.type === 'in' ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-foreground line-clamp-1">{tx.title}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{tx.date} • {tx.category}</p>
                                </div>
                                <div className={cn(
                                    "text-sm font-black tracking-tight",
                                    tx.type === 'in' ? "text-green-500" : "text-red-500"
                                )}>
                                    {tx.type === 'in' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
