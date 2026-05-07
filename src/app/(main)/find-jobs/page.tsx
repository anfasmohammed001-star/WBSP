'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Filter, ChevronRight, Briefcase, Star, ShieldCheck, Wrench, Zap, Sparkles, Palette, Hammer, Leaf, Laptop, Plus, X, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '@/services/jobService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { id: 'Plumbing', label: 'Plumbing', icon: Wrench, color: 'bg-blue-100/80 text-blue-500' },
    { id: 'Electrical', label: 'Electrical', icon: Zap, color: 'bg-yellow-100/80 text-yellow-500' },
    { id: 'Cleaning', label: 'Cleaning', icon: Sparkles, color: 'bg-purple-100/80 text-purple-500' },
    { id: 'Painting', label: 'Painting', icon: Palette, color: 'bg-pink-100/80 text-pink-500' },
    { id: 'Carpentry', label: 'Carpentry', icon: Hammer, color: 'bg-orange-100/80 text-orange-500' },
    { id: 'Gardening', label: 'Gardening', icon: Leaf, color: 'bg-emerald-100/80 text-emerald-500' },
    { id: 'Tech', label: 'Tech', icon: Laptop, color: 'bg-indigo-100/80 text-indigo-500' },
    { id: 'More', label: 'More', icon: Plus, color: 'bg-slate-100/80 text-slate-500' },
];

export default function FindJobsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        category: 'All',
        minBudget: 0,
        maxBudget: 10000,
        date: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true);
                const fetchedJobs = await jobService.getPremiumJobs();
                setJobs(fetchedJobs || []);
            } catch (error) {
                console.error("Error loading premium jobs:", error);
                toast.error("Failed to load premium jobs");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const title = job.title?.toLowerCase() || '';
        const description = job.description?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        const matchesSearch = title.includes(search) || description.includes(search);

        // Use either the immediate button category OR the detailed filter category
        const currentCat = isFilterOpen ? filterOptions.category : selectedCategory;
        const matchesCategory = currentCat === 'All' || job.category?.toLowerCase() === currentCat.toLowerCase();

        const matchesBudget = (job.budget >= filterOptions.minBudget) && (job.budget <= filterOptions.maxBudget);

        const matchesDate = !filterOptions.date || (new Date(job.created_at).toDateString() === new Date(filterOptions.date).toDateString());

        return matchesSearch && matchesCategory && matchesBudget && matchesDate;
    });

    const handleCategoryClick = (catId: string) => {
        if (catId === 'More') {
            setIsFilterOpen(true);
        } else {
            setSelectedCategory(prev => prev === catId ? 'All' : catId);
            setFilterOptions(prev => ({ ...prev, category: catId }));
        }
    };

    const applyFilters = () => {
        setSelectedCategory(filterOptions.category);
        setIsFilterOpen(false);
        toast.success("Filters Applied");
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 flex flex-col items-center overflow-x-hidden">
            {/* Header / Search */}
            <header className="w-full bg-card/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-5 border-b border-border flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            Premium Market
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Verified High-Value Gigs</p>
                    </div>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find your next project..."
                            className="w-full h-14 bg-secondary/30 border border-border/50 rounded-2xl pl-11 pr-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
                            isFilterOpen ? "bg-primary text-white border-primary" : "bg-card border-border hover:bg-secondary text-foreground"
                        )}
                    >
                        <Filter className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Categories Grid (As per reference) */}
            <section className="w-full max-w-2xl px-6 pt-8 space-y-4">
                <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-black tracking-tight">Categories</h2>
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                    >
                        See All
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={cn(
                                "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-sm border border-transparent",
                                selectedCategory === cat.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "group-hover:shadow-md group-hover:-translate-y-1",
                                cat.color
                            )}>
                                <cat.icon className="h-7 w-7" />
                            </div>
                            <span className={cn(
                                "text-[11px] font-bold transition-colors",
                                selectedCategory === cat.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {cat.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Content Area */}
            <main className="w-full max-w-2xl px-6 py-10">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-6">
                            <div className="relative h-16 w-16">
                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Syncing Database</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-card/30 border border-dashed border-border rounded-[3.5rem] p-12 backdrop-blur-sm"
                        >
                            <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <Search className="h-10 w-10 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-2xl font-black mb-3">No Results Match</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-10 font-medium leading-relaxed">
                                We couldn't find any premium jobs with your current selection. Expand your filters to see more results!
                            </p>
                            <Button
                                variant="secondary"
                                className="rounded-2xl h-12 px-8 font-bold"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setFilterOptions({ category: 'All', minBudget: 0, maxBudget: 10000, date: '' });
                                }}
                            >
                                Reset Marketplace
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {filteredJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, type: 'spring', damping: 15 }}
                                    onClick={() => navigate(`/worker/job/${job.id}`)}
                                    className="bg-card border border-border/60 rounded-[3.5rem] shadow-premium hover:shadow-hover hover:border-primary/40 transition-all duration-500 group cursor-pointer overflow-hidden"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={job.images?.[0] || 'https://images.unsplash.com/photo-1581578731117-6f847b204786?auto=format&fit=crop&w=600&q=80'}
                                            alt={job.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 right-6">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-2xl border border-white/20 shadow-xl">
                                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-black tracking-widest uppercase">Verified Premium</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-black text-primary tracking-[0.2em] uppercase">{job.category || 'General'}</span>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                                    <span className="text-[11px] font-bold text-muted-foreground uppercase">{new Date(job.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <h2 className="text-3xl font-black tracking-tighter leading-[1.1] group-hover:text-primary transition-colors">{job.title}</h2>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-4xl font-black text-emerald-500 font-mono tracking-tighter drop-shadow-sm">${job.budget}</div>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Total Budget</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-80">
                                            {job.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/40">
                                            <div className="flex items-center text-[13px] font-bold text-foreground/80">
                                                <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center mr-3">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                {job.location_address || 'Remote Territory'}
                                            </div>
                                            <div className="flex items-center text-[13px] font-bold text-foreground/80">
                                                <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center mr-3">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                </div>
                                                {job.job_type === 'spot' ? 'Immediate Action' : 'Scheduled Start'}
                                            </div>
                                        </div>

                                        <Button
                                            variant="premium"
                                            className="w-full rounded-[2rem] h-16 font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl transition-transform active:scale-[0.98]"
                                        >
                                            Inquire About Post <ChevronRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Filter Modal Overlay */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-card w-full max-w-md rounded-t-[3.5rem] sm:rounded-[4rem] p-10 border border-white/10 shadow-3xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight">Market Filters</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">Target Specific Gigs</p>
                                </div>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                {/* Category Select */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Professional Category
                                    </label>
                                    <select
                                        value={filterOptions.category}
                                        onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full h-14 bg-secondary/50 border border-border rounded-2xl px-5 font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="All">All Categories</option>
                                        {CATEGORIES.filter(c => c.id !== 'More').map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Budget Range */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" /> Budget Threshold ($)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={filterOptions.minBudget}
                                                onChange={(e) => setFilterOptions(prev => ({ ...prev, minBudget: parseInt(e.target.value) || 0 }))}
                                                className="w-full h-14 bg-secondary/50 border border-border rounded-2xl pl-8 pr-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={filterOptions.maxBudget}
                                                onChange={(e) => setFilterOptions(prev => ({ ...prev, maxBudget: parseInt(e.target.value) || 10000 }))}
                                                className="w-full h-14 bg-secondary/50 border border-border rounded-2xl pl-8 pr-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Date Filter */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Posted Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filterOptions.date}
                                        onChange={(e) => setFilterOptions(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full h-14 bg-secondary/50 border border-border rounded-2xl px-5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button
                                        variant="premium"
                                        className="w-full h-16 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl"
                                        onClick={applyFilters}
                                    >
                                        Apply Market Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
