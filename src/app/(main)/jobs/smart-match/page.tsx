import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Map as MapIcon, List, Filter, Zap, Heart, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function SmartMatch() {
    const navigate = useNavigate();
    const [view, setView] = useState<'map' | 'list'>('map');

    const matches = [
        {
            id: 1,
            title: "Urgent: Leak Repair",
            match: 98,
            distance: "1.2 mi",
            budget: "$150",
            location: "Downtown, SF",
            coords: { top: '30%', left: '40%' }
        },
        {
            id: 2,
            title: "Water Heater Install",
            match: 92,
            distance: "3.5 mi",
            budget: "$400",
            location: "Mission District",
            coords: { top: '50%', left: '60%' }
        },
        {
            id: 3,
            title: "Pipe Maintenance",
            match: 85,
            distance: "5.0 mi",
            budget: "$200",
            location: "SoMa",
            coords: { top: '70%', left: '30%' }
        }
    ];

    return (
        <div className="h-screen bg-[#020817] text-white flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between bg-[#020817]/90 backdrop-blur-sm z-20 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-lg font-black flex items-center gap-2">
                            Smart Match
                            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI-Powered Job Feed</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
                        <button
                            onClick={() => setView('map')}
                            className={cn("p-1.5 rounded-lg transition-all", view === 'map' ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white")}
                        >
                            <MapIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn("p-1.5 rounded-lg transition-all", view === 'list' ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {view === 'map' ? (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900"
                        >
                            {/* Stylized Dark Map Placeholder */}
                            <div className="w-full h-full relative opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12,0/800x600@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2xsN3l2aGwwM2VmMm9uYnBwYXk1cDNpIn0.1')] bg-cover bg-center grayscale px-6 py-6">
                                {/* Map Markers */}
                                {matches.map(job => (
                                    <motion.button
                                        key={job.id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: job.id * 0.1 }}
                                        className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center animate-pulse"
                                        style={{ top: job.coords.top, left: job.coords.left }}
                                    >
                                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 bg-[#020817] border border-white/10 px-3 py-2 rounded-xl whitespace-nowrap shadow-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-white">{job.match}% Match</span>
                                                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{job.budget} • {job.distance}</div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Floating "Scan" Button */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                <Button className="h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10 animate-bounce">
                                    Scanning Area...
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4 space-y-4 overflow-y-auto h-full"
                        >
                            {matches.map(job => (
                                <div key={job.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-wide border border-amber-500/20">{job.match}% Match</span>
                                                </div>
                                                <h3 className="font-bold text-lg text-white leading-tight">{job.title}</h3>
                                            </div>
                                        </div>
                                        <button className="text-slate-600 hover:text-pink-500 transition-colors">
                                            <Heart className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                            {job.location}
                                        </div>
                                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                        <div>{job.distance} away</div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Budget</span>
                                            <span className="text-xl font-black text-white">{job.budget}</span>
                                        </div>
                                        <Button className="bg-white text-black hover:bg-slate-200 font-bold rounded-xl px-6">
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
