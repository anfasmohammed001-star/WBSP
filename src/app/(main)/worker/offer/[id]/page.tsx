'use client';

import {
    MapPin,
    Calendar,
    Clock,
    Share2,
    ChevronLeft,
    MoreHorizontal,
    CheckCircle2,
    Sparkles,
    AlertTriangle,
    X,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jobService } from '@/services/jobService';
import { useAuth } from '@/hooks/useAuth';

export default function JobOfferPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                const data = await jobService.getJobDetails(id);
                setJob(data);
            } catch (error) {
                console.error("Failed to load offer", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleAccept = async () => {
        if (!job || !user) return;
        try {
            await jobService.assignWorker(job.id, user.id);
            navigate(`/worker/job/${job.id}`);
        } catch (e) {
            console.error(e);
            alert("Failed to accept job");
        }
    };

    const handleDecline = async () => {
        if (!job) return;
        try {
            await jobService.declineJob(job.id);
            navigate('/worker/job-alerts');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Offer...</div>;
    }

    if (!job) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Offer not found.</div>;
    }

    return (
        <div className="bg-background min-h-screen pb-32 transition-colors duration-300 relative text-foreground">
            {/* Hero Image Section */}
            <div className="relative h-80 w-full overflow-hidden">
                <img
                    src={job.media && job.media[0] ? job.media[0].url : "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"}
                    alt={job.title}
                    className="w-full h-full object-cover"
                />
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
                        <div className="px-3 py-1 bg-red-500 rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center shadow-lg animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expires in 2:00
                        </div>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <div className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">{job.category}</div>
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-black tracking-tight leading-tight max-w-[70%]">{job.title}</h1>
                        <div className="text-4xl font-black tracking-tighter text-green-400">${job.budget}</div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20 space-y-8">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Date', value: job.date || 'Today', icon: Calendar },
                        { label: 'Time', value: job.time || 'ASAP', icon: Clock },
                        { label: 'Location', value: 'Springfield, IL', icon: MapPin },
                        { label: 'Distance', value: '1.2 miles', icon: CheckCircle2 },
                    ].map((item) => (
                        <div key={item.label} className="bg-card/95 backdrop-blur-sm p-4 rounded-[2rem] border border-border flex space-x-3 items-center shadow-sm">
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
                    <div className="bg-card border border-border p-6 rounded-[2.5rem] shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            {job.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-50">
                <div className="max-w-md mx-auto flex space-x-4">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10"
                    >
                        Decline
                    </Button>
                    <Button
                        variant="premium"
                        onClick={handleAccept}
                        className="flex-[2] rounded-2xl h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/25"
                    >
                        Accept Job
                    </Button>
                </div>
            </div>
        </div>
    );
}
