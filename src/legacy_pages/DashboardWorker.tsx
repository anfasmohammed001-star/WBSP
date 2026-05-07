import { useState, useEffect } from 'react';
import { CheckCircle, Bookmark, MapPin, TrendingUp, Clock, Menu } from 'lucide-react'; // Keeping TrendingUp as it's used in Stats Grid
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import HamburgerMenu from '../components/layout/HamburgerMenu';

export default function WorkerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const stats = [
        {
            label: 'TOTAL EARNINGS',
            value: '$14,820.50',
            trend: '+12.4% this month',
            icon: '💰',
        },
        {
            label: 'JOBS COMPLETED',
            value: '186',
            trend: 'Top 1% Provider',
            icon: <CheckCircle className="h-5 w-5 text-green-400" />,
        }
    ];

    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const fetchedJobs = await jobService.getJobsByStatus('posted');
                // Map DB jobs to UI format
                const mappedJobs = fetchedJobs.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    category: job.category || 'GENERAL',
                    price: `$${job.budget}`,
                    location: job.location_address || 'Remote',
                    distance: 'Calculating...', // Placeholder
                    duration: job.job_type === 'spot' ? 'Immediate' : 'Scheduled',
                    startTime: job.job_type === 'spot' ? 'ASAP' : `${job.date} ${job.time}`,
                    tag: job.urgency_level === 'High' ? 'URGENT' : 'NEW',
                    tagColor: job.urgency_level === 'High' ? 'bg-red-500/90 text-white' : 'bg-blue-500/90 text-white',
                    image: 'https://images.unsplash.com/photo-1581578731117-6f847b204786?auto=format&fit=crop&w=600&q=80' // Placeholder
                }));
                setJobs(mappedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="bg-background min-h-screen text-foreground pb-32 no-scrollbar transition-colors duration-300 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Profile Overview */}
            <div className="px-6 pt-6 pb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=alex" alt="Alex" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Alex Sterling</h2>
                        <div className="flex items-center space-x-2 mt-0.5">
                            <span className="flex items-center text-[10px] font-bold text-green-400 uppercase tracking-widest leading-none">
                                <CheckCircle className="h-3 w-3 mr-1" /> Active Now
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                Master Level
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                    <Menu className="h-6 w-6 text-foreground" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="px-6 grid grid-cols-2 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card/50 border border-border p-5 rounded-[2rem] space-y-2 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground tracking-wider w-20 leading-tight">{stat.label}</span>
                            <span className="text-xl text-foreground">{typeof stat.icon === 'string' ? stat.icon : stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                        <div className={cn(
                            "text-[10px] font-bold flex items-center",
                            i === 0 ? "text-green-400" : "text-blue-400"
                        )}>
                            {i === 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Worker Toolkit */}
            <div className="px-6 mb-8">
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-4">Worker Toolkit</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Auto', icon: <div className="text-xl">🤖</div>, path: '/worker/automation', color: 'bg-blue-500/10 text-blue-500' },
                        { label: 'Quality', icon: <div className="text-xl">✅</div>, path: '/worker/quality', color: 'bg-green-500/10 text-green-500' },
                        { label: 'Shifts', icon: <div className="text-xl">📅</div>, path: '/worker/preferences', color: 'bg-orange-500/10 text-orange-500' },
                        { label: 'Growth', icon: <div className="text-xl">📈</div>, path: '/worker/advanced-analytics', color: 'bg-purple-500/10 text-purple-500' },
                        { label: 'Credits', icon: <div className="text-xl">🪙</div>, path: '/worker/credits', color: 'bg-yellow-500/10 text-yellow-500' },
                        { label: 'Files', icon: <div className="text-xl">📂</div>, path: '/worker/resources-share', color: 'bg-indigo-500/10 text-indigo-500' },
                        { label: 'Local', icon: <div className="text-xl">📍</div>, path: '/worker/local-support', color: 'bg-red-500/10 text-red-500' },
                        { label: 'Review', icon: <div className="text-xl">⭐</div>, path: '/worker/request-review', color: 'bg-teal-500/10 text-teal-500' },
                    ].map((tool, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(tool.path)}
                            className="flex flex-col items-center justify-center space-y-2"
                        >
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm", tool.color)}>
                                {tool.icon}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Feed */}
            <div className="px-6 space-y-6">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Available Premium Jobs</h3>
                    <button
                        className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                        onClick={() => navigate('/jobs')}
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-8">
                    {isLoading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No jobs available right now.</div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="bg-card border border-border rounded-[2.5rem] overflow-hidden group shadow-premium hover:shadow-2xl transition-all duration-300">
                                <div className="relative h-60">
                                    <img src={job.image} alt={job.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-4 right-4">
                                        <span className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase", job.tagColor)}>
                                            {job.tag}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-primary tracking-[0.1em] uppercase">{job.category}</div>
                                            <h4 className="text-2xl font-bold tracking-tight leading-none text-card-foreground">{job.title}</h4>
                                        </div>
                                        <div className="text-3xl font-black text-green-400 font-mono tracking-tighter">{job.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3">
                                        <div className="flex items-center text-xs font-semibold text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center text-xs font-semibold text-muted-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mr-2" />
                                            {job.distance}
                                        </div>
                                        <div className="flex items-center text-xs font-semibold text-muted-foreground">
                                            <Clock className="h-4 w-4 mr-2 text-primary" />
                                            {job.duration}
                                        </div>
                                        <div className="flex items-center text-xs font-semibold text-muted-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mr-2" />
                                            {job.startTime}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            variant="premium"
                                            size="xl"
                                            className="flex-1 rounded-2xl h-16 text-lg font-black tracking-wider uppercase shadow-lg shadow-primary/20"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!user) {
                                                    alert("Please log in to accept jobs");
                                                    return;
                                                }
                                                try {
                                                    await jobService.assignWorker(job.id, user.id);
                                                    navigate(`/worker/job/${job.id}`, { state: { job: { ...job, status: 'assigned' } } });
                                                } catch (error) {
                                                    console.error("Error accepting job:", error);
                                                    alert("Failed to accept job. It might be taken.");
                                                }
                                            }}
                                        >
                                            Accept Job
                                        </Button>
                                        <button className="h-16 w-16 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors">
                                            <Bookmark className="h-6 w-6 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>

            {/* Bottom Nav is handled by Layout.tsx */}
        </div>
    );
}
