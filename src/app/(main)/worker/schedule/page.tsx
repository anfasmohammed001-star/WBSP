'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar as CalendarIcon,
    ChevronRight,
    Filter,
    Briefcase,
    Clock,
    MapPin,
    ArrowUpRight,
    Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { jobService } from '@/services/jobService';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
    isAfter,
    startOfDay
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Repair', 'Tech', 'Delivery'];

export default function WorkerSchedule() {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableJobs, setAvailableJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetching open jobs. status 'open' = unaccepted.
                const jobs = await jobService.getAvailableJobs();
                setAvailableJobs(jobs || []);
            } catch (err) {
                console.error("Failed to load calendar jobs", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Calendar Generation Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const filteredJobs = useMemo(() => {
        return availableJobs.filter(job => {
            const matchesCategory = activeCategory === 'All' || job.category.toLowerCase() === activeCategory.toLowerCase();
            return matchesCategory;
        });
    }, [availableJobs, activeCategory]);

    const getJobsForDate = (date: Date) => {
        return filteredJobs.filter(job => {
            if (!job.scheduled_date) return false;
            return isSameDay(parseISO(job.scheduled_date), date);
        });
    };

    const jobsOnSelectedDate = useMemo(() => {
        return getJobsForDate(selectedDate);
    }, [selectedDate, filteredJobs]);

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="bg-background min-h-screen text-foreground pb-20 dark">
            {/* Header */}
            <header className="p-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-xl bg-secondary/80 border border-border/50 hover:bg-secondary transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Opportunity Calendar</h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Regional Market Hub</p>
                        </div>
                    </div>
                </div>

                {/* Categories Filter */}
                <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeCategory === cat
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-6 space-y-8">
                {/* Calendar Grid Container */}
                <section className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="p-6 flex items-center justify-between border-b border-border/30 bg-secondary/10">
                        <h2 className="text-lg font-black tracking-tight">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                            <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronRight className="h-4 w-4" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-border/20">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-card">
                                {d}
                            </div>
                        ))}
                        {calendarDays.map((day, idx) => {
                            const dayJobs = getJobsForDate(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());
                            const isSelected = isSameDay(day, selectedDate);
                            const isPast = !isToday && !isAfter(startOfDay(day), startOfDay(new Date()));

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(day)}
                                    className={cn(
                                        "min-h-[100px] p-2 flex flex-col items-start gap-1 transition-all relative group bg-card",
                                        !isCurrentMonth && "opacity-20",
                                        isPast && "bg-secondary/5"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-black h-7 w-7 flex items-center justify-center rounded-lg transition-all",
                                        isToday ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                            isSelected ? "bg-secondary text-foreground border border-border/50" :
                                                "text-muted-foreground group-hover:bg-secondary/50"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    <div className="flex flex-wrap gap-1 mt-auto w-full">
                                        {dayJobs.slice(0, 3).map((job, i) => (
                                            <div
                                                key={i}
                                                className="h-1.5 flex-1 min-w-[3px] rounded-full bg-primary"
                                                title={job.title}
                                            />
                                        ))}
                                        {dayJobs.length > 3 && (
                                            <div className="text-[8px] font-black text-primary">+{dayJobs.length - 3}</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Day Details View */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Work on {format(selectedDate, 'MMMM d')}</h3>
                            <p className="text-xs font-bold text-foreground/70">{jobsOnSelectedDate.length} Jobs Available</p>
                        </div>
                        <CalendarIcon className="h-5 w-5 text-primary opacity-50" />
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {jobsOnSelectedDate.length > 0 ? jobsOnSelectedDate.map((job, i) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(`/worker/job/${job.id}`)}
                                    className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98] shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary border border-border/50">
                                            <Briefcase className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                                                    {job.category}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="h-2.5 w-2.5 fill-amber-500" />
                                                    <span className="text-[10px] font-black">4.9</span>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{job.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1.5">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{job.time || 'flexible'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{job.distance || '2.4 km'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-foreground">${job.budget}</div>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-secondary/5 rounded-3xl border border-dashed border-border/50"
                                >
                                    <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-muted-foreground">No open jobs for this date yet.</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mt-1">Check another date or category</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
}
