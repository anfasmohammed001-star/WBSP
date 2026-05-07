'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Filter, Heart, ChevronRight, Shield, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function WorkerMarketplace() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const workers = [
        {
            id: '1',
            name: "Mario Sterling",
            profession: "Master Plumber",
            rating: 4.9,
            reviews: 124,
            rate: "$85/hr",
            image: "https://i.pravatar.cc/150?u=mario",
            badged: true,
            location: "San Francisco, CA",
            status: "Available Now",
            specialty: "Hydro-Dynamics"
        },
        {
            id: '2',
            name: "Sarah Jenkins",
            profession: "Interior Designer",
            rating: 5.0,
            reviews: 89,
            rate: "$120/hr",
            image: "https://i.pravatar.cc/150?u=sarah",
            badged: false,
            location: "Oakland, CA",
            status: "On Mission",
            specialty: "Matrix Aesthetics"
        },
        {
            id: '3',
            name: "David Chen",
            profession: "Electrician",
            rating: 4.8,
            reviews: 215,
            rate: "$95/hr",
            image: "https://i.pravatar.cc/150?u=david",
            badged: true,
            location: "San Jose, CA",
            status: "Available Now",
            specialty: "Circuitry Flux"
        }
    ];

    const filters = ['All', 'Plumbers', 'Electricians', 'Cleaners', 'Painters', 'Designers'];

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-purple-600/5 top-[30%] -right-[20%] scale-150" style={{ animationDelay: '-4s' }} />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 px-6 pt-12 pb-6 glass-obsidian border-b border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Operative Network</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-1">Global Marketplace</h1>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Identify and deploy elite specialists in real-time.</p>
                </motion.div>
            </header>

            {/* Search & Tactical Filters */}
            <div className="px-6 py-8 space-y-8 relative z-10">
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify specific vector or skill..."
                            className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-[2rem] focus:outline-none focus:border-primary/50 focus:ring-[12px] focus:ring-primary/5 transition-all font-bold text-lg placeholder:text-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all active:scale-95 shadow-xl">
                        <Filter className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-fade-edges">
                    {filters.map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(cat)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                                activeFilter === cat
                                    ? "bg-primary text-white border-primary shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Operative Matrix (Worker List) */}
            <div className="px-6 space-y-6 relative z-10">
                {workers.map((worker, idx) => (
                    <motion.div
                        key={worker.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card
                            onClick={() => navigate(`/worker/profile/${worker.id}`)}
                            className="glass-obsidian border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                <Shield className="w-32 h-32 text-primary" />
                            </div>

                            <CardContent className="p-8">
                                <div className="flex gap-8 items-start">
                                    <div className="relative shrink-0">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-primary/20 p-1 bg-glass-obsidian shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                            <img src={worker.image} className="w-full h-full rounded-[1.8rem] object-cover" alt={worker.name} />
                                        </div>
                                        {worker.badged && (
                                            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl border-4 border-[#020408] shadow-lg shadow-primary/40">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                                        worker.status === 'Available Now' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                                                    )}>
                                                        {worker.status}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{worker.specialty}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{worker.name}</h3>
                                                <p className="text-white/40 text-sm font-black uppercase tracking-[0.2em]">{worker.profession}</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                                                <Star className="w-4 h-4 text-primary fill-primary" />
                                                <span className="text-sm font-black text-white">{worker.rating}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-2.5 text-[10px] text-white/40 font-black uppercase tracking-widest">
                                                <MapPin className="w-3.5 h-3.5 text-primary/60" />
                                                {worker.location}
                                            </div>
                                            <div className="flex items-center justify-end gap-3 font-black">
                                                <span className="text-xs text-white/30 uppercase tracking-widest">Yield</span>
                                                <span className="text-xl text-white tracking-tighter">{worker.rate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Network Stats Ticker */}
            <div className="fixed bottom-0 left-0 right-0 h-10 bg-primary/10 backdrop-blur-2xl border-t border-primary/20 flex items-center overflow-hidden z-50">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    className="flex items-center gap-12 whitespace-nowrap px-6"
                >
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <Zap className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">NEW OPERATIVE VERIFIED IN SECTOR 7: @ALEX_V</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">LIVE YIELD BOOST ACTIVE: +15%</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
