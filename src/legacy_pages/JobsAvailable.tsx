import { useState, useEffect } from 'react';
import { Search, ChevronLeft, List, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard } from '../components/jobs/JobCard';

import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';

export default function JobsAvailable() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
    const [allJobs, setAllJobs] = useState<any[]>([]); // Store all fetched jobs
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]); // Store displayed jobs
    const [isLoading, setIsLoading] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false); // For mobile/expansion if needed

    const filterOptions = [
        { id: 'radius', label: 'Radius: 50mi', type: 'radius', value: 50 },
        { id: 'budget', label: 'Budget: $100+', type: 'budget', value: 100 },
        { id: 'urgent', label: 'Urgent', type: 'tag', value: 'High' },
        { id: 'Plumbing', label: 'Plumbing', type: 'category', value: 'PLUMBING' },
        { id: 'Electrical', label: 'Electrical', type: 'category', value: 'ELECTRICAL' },
        { id: 'Cleaning', label: 'Cleaning', type: 'category', value: 'CLEANING' },
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
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

    // Effect to apply filters whenever search or filters change
    useEffect(() => {
        let result = allJobs;

        // 1. Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(lowerQuery) ||
                job.description.toLowerCase().includes(lowerQuery) ||
                job.category?.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Chip Filters
        if (activeFilters.length > 0) {
            activeFilters.forEach(filterId => {
                const filter = filterOptions.find(f => f.id === filterId);
                if (!filter) return;

                if (filter.type === 'budget') {
                    // Filter for budget >= value
                    result = result.filter(job => job.budget >= (filter.value as number));
                } else if (filter.type === 'tag') {
                    // Filter for urgency
                    result = result.filter(job => job.urgency_level === filter.value);
                } else if (filter.type === 'category') {
                    // Filter for category (exact match)
                    result = result.filter(job => job.category === filter.value);
                }
                // Radius is ignored for now as we simulate it, 
                // but visually it "activates"
            });
        }

        setFilteredJobs(result);
    }, [searchQuery, activeFilters, allJobs]);

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    const handleAcceptJob = async (job: any) => {
        if (!user) {
            alert("Please log in to accept jobs");
            return;
        }
        try {
            await jobService.assignWorker(job.id, user.id);
            navigate(`/worker/job/${job.id}`, { state: { job: { ...job, status: 'assigned' } } });
        } catch (error) {
            console.error("Error accepting job:", error);
            alert("Failed to accept job.");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background text-foreground transition-colors duration-300">
            {/* Search Header */}
            <div className="p-6 pb-4 space-y-4 shrink-0 z-10 bg-background">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary border-none rounded-2xl h-14 pl-12 pr-4 font-bold text-foreground focus:ring-primary focus:ring-2 outline-none transition-all placeholder:text-muted-foreground"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                x
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                        className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        {viewMode === 'map' ? <List className="h-6 w-6" /> : <MapIcon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                    <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="flex items-center space-x-2 px-4 py-2 bg-foreground text-background rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="text-xs font-bold">Filters</span>
                    </button>
                    {filterOptions.map((filter) => {
                        const isActive = activeFilters.includes(filter.id);
                        return (
                            <button
                                key={filter.id}
                                onClick={() => toggleFilter(filter.id)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                                    isActive
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-card border-border text-muted-foreground hover:bg-secondary"
                                )}
                            >
                                {filter.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {viewMode === 'map' ? (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-secondary/30"
                        >
                            <div className="text-center p-6">
                                <h3 className="text-lg font-bold text-muted-foreground">Map View Coming Soon</h3>
                                <p className="text-sm text-muted-foreground/70">View jobs on a live map.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 z-0 p-6 pt-0 overflow-y-auto no-scrollbar space-y-6 bg-background"
                        >
                            <div className="flex justify-between items-baseline pt-2">
                                <h3 className="text-xl font-black text-foreground">Available Jobs</h3>
                                <span className="text-xs font-bold text-muted-foreground">{filteredJobs.length} results</span>
                            </div>

                            {isLoading ? (
                                <div className="text-center p-10 text-muted-foreground">Loading...</div>
                            ) : filteredJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="p-4 bg-secondary rounded-full">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">No jobs found</p>
                                        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                                    </div>
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveFilters([]); }}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                filteredJobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        id={job.id}
                                        title={job.title}
                                        category={job.category || 'General'}
                                        distance="Calculating..."
                                        budget={job.budget}
                                        urgency={job.urgency_level || 'Normal'}
                                        postedTime="Recently"
                                        description={job.description}
                                        image="https://images.unsplash.com/photo-1581578731117-6f847b204786?auto=format&fit=crop&w=600&q=80"
                                        onAccept={() => handleAcceptJob(job)}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
