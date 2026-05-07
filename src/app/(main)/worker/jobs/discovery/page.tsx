'use client';

import { useState, useEffect } from 'react';
import { Search, Map as MapIcon, List, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard } from '@/components/jobs/JobCard';
import { useNavigate } from 'react-router-dom';
import { jobService } from '@/services/jobService';
import { useAuth } from '@/hooks/useAuth';

export default function WorkerJobDiscovery() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const filterOptions = [
        { id: 'radius', label: 'Radius: 50mi', type: 'radius', value: 50 },
        { id: 'budget', label: '$200+', type: 'budget', value: 200 },
        { id: 'urgent', label: 'Urgent', type: 'tag', value: 'High' },
        { id: 'Plumbing', label: 'Plumbing', type: 'category', value: 'PLUMBING' },
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // In a real scenario, this would fetch available jobs for workers
                const fetchedJobs = await jobService.getJobsByStatus('posted');
                setAllJobs(fetchedJobs);
                setFilteredJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let result = allJobs;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(lowerQuery) ||
                job.description.toLowerCase().includes(lowerQuery)
            );
        }
        if (activeFilters.length > 0) {
            activeFilters.forEach(filterId => {
                const filter = filterOptions.find(f => f.id === filterId);
                if (!filter) return;
                if (filter.type === 'budget') result = result.filter(job => job.budget >= (filter.value as number));
                if (filter.type === 'tag') result = result.filter(job => job.urgency_level === filter.value);
                if (filter.type === 'category') result = result.filter(job => job.category === filter.value);
            });
        }
        setFilteredJobs(result);
    }, [searchQuery, activeFilters, allJobs]);

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev => prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-4 shadow-sm border-b border-slate-100 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-black text-slate-900">Job Discovery</h1>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={cn("p-2 rounded-lg transition-all", viewMode === 'map' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                        >
                            <MapIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-slate-100 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filterOptions.map(filter => {
                        const isActive = activeFilters.includes(filter.id);
                        return (
                            <button
                                key={filter.id}
                                onClick={() => toggleFilter(filter.id)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                                    isActive
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
                                )}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-400 font-bold">Loading Jobs...</div>
                            ) : filteredJobs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">No jobs found matching your criteria.</div>
                            ) : (
                                filteredJobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        {...job}
                                        image="https://images.unsplash.com/photo-1505798577917-a651a5d40320?auto=format&fit=crop&q=80&w=400"
                                    />
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[60vh] bg-slate-200 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                    <MapIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-slate-900 font-bold">Map View</h3>
                                <p className="text-slate-500 text-sm">Interactive map coming soon.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
