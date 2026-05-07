'use client';

import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Calendar, TrendingUp, Briefcase,
    LayoutGrid, Settings, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

export default function MasterAnalytics() {
    const navigate = useNavigate();

    // Data for Profit Projection (Line/Area Chart)
    const profitData = [
        { name: 'Mon', value: 800 },
        { name: 'Tue', value: 950 },
        { name: 'Wed', value: 1100 },
        { name: 'Thu', value: 980 },
        { name: 'Fri', value: 1400 },
        { name: 'Sat', value: 1240 },
        { name: 'Sun', value: 1600 },
    ];

    // Data for Income Sources (Bar Chart)
    const incomeData = [
        { name: 'W1', spot: 60, scheduled: 30 },
        { name: 'W2', spot: 80, scheduled: 20 },
        { name: 'W3', spot: 40, scheduled: 50 },
        { name: 'W4', spot: 90, scheduled: 40 },
    ];

    return (
        <div className="min-h-screen bg-[#030208] text-white font-sans pb-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] left-[-20%] w-[400px] h-[400px] bg-[#00f2ff]/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                            <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </button>
                </div>
                <div className="text-center">
                    <h1 className="text-lg font-bold tracking-tight">Master Analytics</h1>
                    <p className="text-[10px] text-[#00f2ff] font-bold tracking-widest uppercase">WBSP PLATFORM</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                    <Calendar className="w-5 h-5 text-white/70" />
                </button>
            </header>

            <main className="px-5 space-y-4 relative z-10">

                {/* Profit Projection Card */}
                <div className="glass-premium rounded-[2rem] p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-[#00f2ff]"></div>
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Profit Projection</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black tracking-tight">$1,240.00</h2>
                                <div className="px-2 py-1 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/20 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3 text-[#00f2ff]" />
                                    <span className="text-[10px] font-bold text-[#00f2ff]">12.5%</span>
                                </div>
                            </div>
                            <p className="text-xs text-white/30 mt-1 font-medium">Weekly Forecast Based on Current Flow</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-primary/50" />
                    </div>

                    {/* Chart Area */}
                    <div className="h-40 w-full -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff30', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e1e2d', borderRadius: '10px', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Quality Score - Circle Chart */}
                    <div className="glass-premium rounded-[2rem] p-5 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                                <circle cx="48" cy="48" r="40" stroke="#00f2ff" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="5" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xl font-black">98%</span>
                        </div>
                        <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Quality Score</h3>
                        <span className="text-xs font-bold text-[#00f2ff]">+2.1% Peak</span>
                    </div>

                    {/* Completion Rate */}
                    <div className="glass-premium rounded-[2rem] p-5 relative">
                        <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Completion</h3>
                        <div className="text-3xl font-black mb-4">94.2%</div>

                        {/* Mini Bar Chart simulation */}
                        <div className="flex items-end gap-1.5 h-16 w-full">
                            {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
                                <div key={i} className={`w-1.5 rounded-full ${i === 5 ? 'bg-[#00f2ff]' : 'bg-white/10'}`} style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 mt-2 block">+0.5% shift avg</span>
                    </div>
                </div>

                {/* Top Skill Card */}
                <div className="glass-premium rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Top Earning Skill</p>
                            <h3 className="text-base font-bold text-white">Electrical Repair</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black text-[#00f2ff]">$42/hr</div>
                        <div className="text-[10px] text-white/30 font-medium">Premium Tier</div>
                    </div>
                </div>

                {/* Income Sources Bar Chart */}
                <div className="glass-premium rounded-[2rem] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-lg font-bold">Income Sources</h2>
                        <div className="w-4 h-4 rounded-full bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] text-[10px] font-bold">!</div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold text-white/50 mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#00f2ff]"></div> Spot Jobs
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/20"></div> Scheduled
                        </div>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeData} barSize={40} stackOffset="expand">
                                <Bar dataKey="spot" stackId="a" fill="#00f2ff" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="scheduled" stackId="a" fill="#ffffff20" radius={[4, 4, 0, 0]} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff30', fontSize: 10 }} dy={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Market Insights Carousel (Horizontal Scroll) */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Market Insights</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {/* Card 1 */}
                        <div className="glass-deep min-w-[200px] p-5 rounded-2xl border-l-4 border-l-destructive">
                            <p className="text-[9px] font-bold text-white/40 uppercase mb-1">High Demand</p>
                            <h3 className="text-base font-bold mb-3">New York City</h3>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-destructive"></div>)}
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="glass-deep min-w-[200px] p-5 rounded-2xl border-l-4 border-l-[#00f2ff]">
                            <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Growing</p>
                            <h3 className="text-base font-bold mb-3">Remote Labs</h3>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]"></div>)}
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="glass-deep min-w-[200px] p-5 rounded-2xl border-l-4 border-l-yellow-500">
                            <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Moderate</p>
                            <h3 className="text-base font-bold mb-3">San Francisco</h3>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>)}
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom Nav (Consistent with Design) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-deep rounded-3xl p-4 flex justify-between items-center z-50 shadow-2xl border border-white/10 ring-1 ring-black/20">
                <button onClick={() => navigate('/dashboard/worker')} className="p-3 rounded-2xl text-white/40 hover:bg-white/5 active:scale-90 transition-all">
                    <LayoutGrid className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-2xl text-white/40 hover:bg-white/5 active:scale-90 transition-all">
                    <Briefcase className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-2xl bg-white/10 text-white border border-white/10 shadow-inner active:scale-90 transition-all">
                    <TrendingUp className="w-6 h-6" /> {/* Active Tab */}
                </button>
                <button onClick={() => navigate('/settings')} className="p-3 rounded-2xl text-white/40 hover:bg-white/5 active:scale-90 transition-all">
                    <Settings className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
}
