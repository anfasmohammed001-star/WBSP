'use client';

import { Plus, Clock, ChevronRight, Search, MapPin, Sparkles, TrendingUp, Wallet, CheckCircle, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/dashboardService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import SystemHub from '@/components/layout/SystemHub';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [locationName, setLocationName] = useState<string>('Locating...');

    // Realtime Reactive Query
    const dashboardData = useLiveQuery(async () => {
        if (!user) return { stats: { pendingJobs: 0, completedJobs: 0, totalSpent: 0 }, activeJobs: [] };

        const allJobs = await db.jobs
            .where('customer_id')
            .equals(user.id)
            .reverse() // Sort desc
            .sortBy('created_at');

        const pendingJobs = allJobs.filter(j => j.status === 'open').length;
        const completedJobs = allJobs.filter(j => j.status === 'completed').length;
        const totalSpent = allJobs
            .filter(j => j.status === 'completed')
            .reduce((sum, j) => sum + (j.budget || 0), 0);

        // Show all recent jobs, regardless of status, for better history visibility
        const recentActivity = allJobs
            .filter(j => ['open', 'assigned', 'in_progress', 'completed'].includes(j.status))
            .slice(0, 10);

        return {
            stats: { pendingJobs, completedJobs, totalSpent },
            activeJobs: recentActivity
        };
    }, [user?.id]);

    const { stats, activeJobs } = dashboardData || {
        stats: { pendingJobs: 0, completedJobs: 0, totalSpent: 0 },
        activeJobs: []
    };

    // Trigger initial background sync when component mounts
    useEffect(() => {
        if (user) dashboardService.getCustomerStats(user.id).catch(console.error);
    }, [user]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocationName("New York, USA"); // Placeholder
            }, (error) => {
                setLocationName("New York, USA");
            });
        }
    }, []);

    // Enhanced Service Categories with Premium Colors
    const services = [
        { id: 'plumbing', name: 'Plumbing', icon: '🔧', color: 'bg-blue-50/50 text-blue-600 border-blue-100 shadow-blue-500/5' },
        { id: 'electrical', name: 'Electrical', icon: '⚡', color: 'bg-amber-50/50 text-amber-600 border-amber-100 shadow-amber-500/5' },
        { id: 'cleaning', name: 'Cleaning', icon: '🧹', color: 'bg-purple-50/50 text-purple-600 border-purple-100 shadow-purple-500/5' },
        { id: 'painting', name: 'Painting', icon: '🎨', color: 'bg-pink-50/50 text-pink-600 border-pink-100 shadow-pink-500/5' },
        { id: 'carpentry', name: 'Carpentry', icon: '🪚', color: 'bg-orange-50/50 text-orange-600 border-orange-100 shadow-orange-500/5' },
        { id: 'gardening', name: 'Gardening', icon: '🌿', color: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' },
        { id: 'tech', name: 'Tech', icon: '💻', color: 'bg-indigo-50/50 text-indigo-600 border-indigo-100 shadow-indigo-500/5' },
        { id: 'more', name: 'View All', icon: <Plus className="w-5 h-5" />, color: 'bg-slate-50 text-slate-600 border-slate-200' },
    ];

    const userName = user?.fullName || 'Guest';

    return (
        <div className="bg-background min-h-screen pb-28 text-foreground relative overflow-hidden">
            {/* Background Decorations */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%]" />
                <div className="blob bg-purple-500/5 top-[20%] -right-[10%]" style={{ animationDelay: '-5s' }} />
            </div>

            <div className="relative z-10 px-6 pt-10 max-w-lg mx-auto">

                {/* 1. Header Section with Market Ticker */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-primary to-purple-600 p-[2px] shadow-2xl shadow-primary/20"
                                >
                                    <div className="w-full h-full rounded-[20px] bg-background flex items-center justify-center overflow-hidden border border-white/10">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-2xl">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background animate-pulse shadow-lg" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Premium Client</span>
                                </div>
                                <h1 className="text-3xl font-black tracking-tight leading-none mt-1">
                                    Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">{userName.split(' ')[0]}</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Market Ticker */}
                    <motion.div
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        onClick={() => navigate('/jobs')}
                        className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 overflow-hidden mask-fade-edges relative h-10 cursor-pointer group/ticker"
                    >
                        <div className="flex items-center gap-2 shrink-0 z-10 bg-[#020408]/80 backdrop-blur-md pr-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] group-hover/ticker:text-primary transition-colors">Live Market:</span>
                        </div>
                        <motion.div
                            animate={{ x: [0, -800] }}
                            transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
                            className="flex items-center gap-12 whitespace-nowrap"
                        >
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">PLUMBING SECTOR: +12% DEMAND</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">ELITE OPERATIVES ONLINE: 482</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">SYSTEM LATENCY: 14MS</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">AVERAGE COMPLETION: 2.4H</span>
                            {/* Duplicated for seamless loop */}
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">PLUMBING SECTOR: +12% DEMAND</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">ELITE OPERATIVES ONLINE: 482</span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* System Hub - NEW FEATURE */}
                <SystemHub type="customer" />

                {/* 2. Elite Membership Card - NEW FEATURE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 relative group cursor-pointer"
                    onClick={() => navigate('/elite')}
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <Card className="relative bg-black border-none rounded-[2.5rem] overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Sparkles className="w-24 h-24 text-primary" />
                        </div>
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">WBSP Elite</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Limited Access</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Upgrade to Elite Matrix</h3>
                                <p className="text-white/40 text-xs font-medium max-w-[180px]">Access priority response times and zero service fees.</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-primary group-hover:border-primary transition-all">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 3. Quick Search & Location */}
                <div className="space-y-4 mb-12">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Deployment Proximity</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                            <MapPin className="w-3 h-3 text-primary" />
                            {locationName}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-20">
                            <Search className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Identify specific vector or service..."
                            className="w-full h-18 pl-14 pr-6 rounded-[2.2rem] bg-card border border-border/40 text-base font-bold focus:ring-[12px] focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-2xl shadow-black/[0.02] placeholder:text-muted-foreground/30"
                        />
                    </div>
                </div>

                {/* 3. Stats Section - ADVANCED ANALYTICS */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <Card className="premium-card p-0 overflow-hidden border-none shadow-xl shadow-black/5">
                        <CardContent className="p-6 relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1">Live</div>
                            </div>
                            <div className="text-4xl font-black mb-1 text-foreground">{stats.pendingJobs}</div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Queued<br />Requests</div>
                        </CardContent>
                    </Card>

                    <Card className="premium-card-primary p-0 overflow-hidden shadow-2xl shadow-primary/20">
                        <CardContent className="p-6 relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Trends</div>
                            </div>
                            <div className="text-4xl font-black mb-1 text-white">4.9/5</div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-white/80 leading-tight">Project<br />Velocity</div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Action Categories */}
                <div className="mb-12">
                    <div className="flex justify-between items-baseline mb-6 px-1">
                        <section>
                            <h2 className="text-xl font-black tracking-tight">Core Services</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Verified Specialists Nearby</p>
                        </section>
                        <button onClick={() => navigate('/jobs')} className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">Explore</button>
                    </div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                        className="grid grid-cols-4 gap-6"
                    >
                        {services.map((service) => (
                            <motion.button
                                key={service.id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8, y: 10 },
                                    visible: { opacity: 1, scale: 1, y: 0 }
                                }}
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (service.id === 'more') navigate('/jobs');
                                    else navigate(`/post-job?category=${encodeURIComponent(service.id)}`);
                                }}
                                className="flex flex-col items-center gap-3 transition-all group"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-xl transition-all duration-300 relative overflow-hidden",
                                    service.color,
                                    "border border-white/40"
                                )}>
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10 group-hover:scale-110 transition-transform">{service.icon}</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">{service.name}</span>
                                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* 5. Live Feed */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-lg font-black tracking-tight">Recent Deployments</h2>
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>

                    <div className="space-y-4">
                        {!dashboardData ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 rounded-3xl bg-secondary/50 animate-pulse" />)}
                            </div>
                        ) : activeJobs.length > 0 ? activeJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => navigate(`/tracking/${job.id}`)}
                            >
                                <Card className="premium-card cursor-pointer p-4 flex items-center gap-5 border-none">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/10">
                                        {services.find(s => s.id === (job as any).category)?.icon || '🏢'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-base truncate">{job.title}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                                                job.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                                            )}>
                                                {job.status !== 'completed' && <div className="w-1 h-1 rounded-full bg-primary animate-ping" />}
                                                {job.status}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-muted-foreground/30" />
                                </Card>
                            </motion.div>
                        )) : (
                            <div className="text-center py-16 px-8 rounded-[2.5rem] border-2 border-dashed border-border/50 bg-secondary/20">
                                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <Plus className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                                <h3 className="font-black text-xl mb-2">Initialize Your Network</h3>
                                <p className="text-muted-foreground text-sm font-medium mb-8">Deploy your first service request to begin scaling your productivity.</p>
                                <Button variant="premium" size="lg" className="w-full" onClick={() => navigate('/post-job')}>Launch New Project</Button>
                            </div>
                        )}

                        {activeJobs.length > 0 && (
                            <Button
                                variant="premium"
                                size="xl"
                                className="w-full sticky bottom-6 shadow-2xl"
                                onClick={() => navigate('/post-job')}
                            >
                                <Plus className="w-6 h-6 mr-3 stroke-[3px]" />
                                New Deployment
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant FAB - NEW FEATURE */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-28 right-6 w-16 h-16 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-50 border-4 border-background"
                onClick={() => navigate('/support')}
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                >
                    <Sparkles className="w-7 h-7" />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
            </motion.button>
        </div>
    );
}

