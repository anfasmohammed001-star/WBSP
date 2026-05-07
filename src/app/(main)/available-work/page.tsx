
import { useState } from 'react';
import {
    Search,
    Filter,
    Map as MapIcon,
    List,
    Wrench,
    Zap,
    Sparkles,
    Truck,
    Paintbrush,
    Leaf,
    User,
    ChevronRight,
    Navigation,
    Info,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

const categoryIcons: any = {
    Plumbing: Wrench,
    Electrical: Zap,
    Cleaning: Sparkles,
    Moving: Truck,
    Painting: Paintbrush,
    Gardening: Leaf,
    General: Briefcase
};

export default function AvailableWorkPage() {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

    const jobs = useLiveQuery(async () => {
        return await db.jobs.where('status').equals('open').reverse().sortBy('created_at');
    }) || [];

    // Generate stable random coords for demo
    const getJobCoords = (id: string) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            x: 20 + (hash % 60), // Keep within 20-80%
            y: 20 + ((hash * 13) % 60)
        };
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col h-[calc(100vh-4.5rem)]">
            {/* Header / Search */}
            <div className="p-4 md:p-6 bg-card border-b border-border space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                        <input
                            type="text"
                            placeholder="Identify specific vector or sector..."
                            className="w-full h-12 bg-secondary/30 border border-white/5 rounded-2xl pl-12 pr-4 font-black transition-all text-sm focus:ring-4 focus:ring-primary/10"
                        />
                    </div>
                    {/* View Toggles */}
                    <div className="flex bg-secondary/30 p-1 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setViewMode('map')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'map' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <MapIcon className="h-4 w-4" />
                            <span>Radar</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'list' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            <List className="h-4 w-4" />
                            <span>Matrix</span>
                        </button>
                    </div>
                </div>

                {/* Category Quick Filter - NEW FEATURE */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide pt-2">
                    {Object.keys(categoryIcons).map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest hover:border-primary/50 transition-all flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-[#f8f9fa] dark:bg-[#0f172a]">
                <AnimatePresence mode="wait">
                    {viewMode === 'map' ? (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#f8f9fa] dark:bg-[#1a1c1e]"
                        >
                            {/* SVG Map Mock - Premium Styled */}
                            <svg className="w-full h-full opacity-50 dark:opacity-20" viewBox="0 0 100 100">
                                <path d="M10,20 Q30,15 50,20 T90,20" stroke="currentColor" fill="none" strokeWidth="0.5" />
                                <path d="M20,10 Q15,40 20,70 T20,90" stroke="currentColor" fill="none" strokeWidth="0.5" />
                                <path d="M0,50 Q40,45 60,55 T100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
                                <path d="M60,0 Q55,40 65,60 T60,100" stroke="currentColor" fill="none" strokeWidth="0.5" />
                            </svg>

                            {/* Job Pins */}
                            {jobs.map((job) => {
                                const coords = getJobCoords(job.id);
                                return (
                                    <motion.button
                                        key={job.id}
                                        whileHover={{ scale: 1.2, zIndex: 50 }}
                                        onClick={() => setSelectedJob(job)}
                                        className={cn(
                                            "absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors border-2",
                                            selectedJob?.id === job.id
                                                ? "bg-primary border-white ring-4 ring-primary/20 text-white z-40"
                                                : "bg-background border-primary/20 text-primary hover:border-primary"
                                        )}
                                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                                    >
                                        <Briefcase className="h-5 w-5" />
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 overflow-y-auto p-6 space-y-4"
                        >
                            {jobs.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                    <p>No available jobs found.</p>
                                </div>
                            ) : (
                                jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        onClick={() => {
                                            setSelectedJob(job);
                                            // Optional: If clicking in list view should also show details or navigate
                                            navigate(`/worker/job/${job.id}`);
                                        }}
                                        className="bg-card border border-border rounded-3xl p-5 flex items-center gap-5 hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                            <Briefcase className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-black text-lg text-foreground">{job.title}</h3>
                                                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full whitespace-nowrap">
                                                    ${job.budget}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{job.description}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                <span>{job.location_address || 'Remote'}</span>
                                                <span>•</span>
                                                <span>{new Date(job.created_at || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <button className="p-3 bg-secondary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Detail Panel (for Map View) */}
                <AnimatePresence>
                    {selectedJob && viewMode === 'map' && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="absolute bottom-6 left-6 right-6 z-50 md:left-auto md:w-96"
                        >
                            <div className="bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                            <Briefcase className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-foreground">{selectedJob.title}</h3>
                                            <p className="text-sm font-bold text-muted-foreground flex items-center gap-1">
                                                <Navigation className="w-3 h-3 text-primary" />
                                                {selectedJob.location_address || 'Remote'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="p-2 bg-secondary/50 rounded-xl"
                                    >
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
                                        <span className="text-[10px] uppercase tracking-wider font-black text-muted-foreground block mb-1">Budget</span>
                                        <div className="flex items-center gap-1.5 font-bold">
                                            ${selectedJob.budget}
                                        </div>
                                    </div>
                                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
                                        <span className="text-[10px] uppercase tracking-wider font-black text-muted-foreground block mb-1">Status</span>
                                        <div className="font-bold capitalize">{selectedJob.status}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/worker/job/${selectedJob.id}`)}
                                        className="w-full h-14 bg-primary text-primary-foreground font-black rounded-2xl px-8 hover:opacity-95 transition-opacity shadow-lg shadow-primary/25"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
