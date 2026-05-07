import {
    MapPin,
    Calendar,
    Clock,
    Share2,
    ChevronLeft,
    MoreHorizontal,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { WorkerCard } from '../components/jobs/WorkerCard';

import { useNavigate } from 'react-router-dom';

export default function JobDetails() {
    const navigate = useNavigate();
    const job = {
        title: 'Emergency Pipe Burst',
        category: 'PLUMBING',
        status: 'Searching',
        description: 'Water is flooding the kitchen. Need someone ASAP to turn off water and fix pipe. The main valve is stuck and I cannot reach it.',
        location: '123 Maple Ave, Springfield',
        date: 'Today, Oct 27',
        time: '2:00 PM',
        budget: 150.00,
        customer: 'Alex Johnson',
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
    };

    const recommendedWorkers = [
        {
            id: 'w1',
            name: 'Alexander Sterling',
            rating: 4.9,
            jobsCompleted: 128,
            skills: ['React', 'Node.js', 'PostgreSQL'],
            distance: '1.2 miles',
            hourlyRate: 85,
            matchScore: 98,
            avatarUrl: 'https://i.pravatar.cc/150?u=alexander',
            isVerified: true
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-32 transition-colors duration-300 relative text-foreground">
            {/* Hero Image Section */}
            <div className="relative h-80 w-full overflow-hidden">
                <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex space-x-2">
                        <button className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <div className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">{job.category}</div>
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-black tracking-tight leading-tight max-w-[70%]">{job.title}</h1>
                        <div className="text-4xl font-black tracking-tighter text-green-400">${job.budget.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20 space-y-8">
                {/* Status Progress (Image 27 style) */}
                <div className="bg-card p-6 rounded-[2.5rem] shadow-xl border border-border space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-primary fill-current" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-primary">AI Matching Status</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground italic">Searching for best match...</span>
                    </div>
                    {/* Segmented Progress Bar */}
                    <div className="flex space-x-1.5 h-2">
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="flex-1 bg-primary rounded-full origin-left" />
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }} className="flex-1 bg-primary rounded-full origin-left opacity-60" />
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }} className="flex-1 bg-primary rounded-full origin-left opacity-30" />
                        <div className="flex-1 bg-secondary rounded-full" />
                        <div className="flex-1 bg-secondary rounded-full" />
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Date', value: job.date, icon: Calendar },
                        { label: 'Time', value: job.time, icon: Clock },
                        { label: 'Location', value: 'Springfield, IL', icon: MapPin },
                        { label: 'Distance', value: '1.2 miles away', icon: CheckCircle2 },
                    ].map((item) => (
                        <div key={item.label} className="bg-card/50 p-4 rounded-[2rem] border border-border flex space-x-3 items-center">
                            <div className="p-2.5 rounded-xl bg-secondary text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">{item.label}</p>
                                <p className="text-xs font-bold text-foreground leading-none mt-1">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black tracking-tight text-foreground px-2">Job Description</h3>
                    <div className="bg-card/50 p-6 rounded-[2.5rem] border border-border">
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            {job.description}
                        </p>
                    </div>
                </div>

                {/* Recommended Provider Slice (Image 27 Bottom) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-lg font-black tracking-tight text-foreground">Top Recommendation</h3>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">98% Match</div>
                    </div>
                    <WorkerCard {...recommendedWorkers[0]} />
                </div>
            </div>

            {/* Fixed Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-50">
                <div className="max-w-7xl mx-auto flex space-x-4">
                    <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest border-2">Cancel Post</Button>
                    <Button variant="premium" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest">Update Details</Button>
                </div>
            </div>
        </div>
    );
}
