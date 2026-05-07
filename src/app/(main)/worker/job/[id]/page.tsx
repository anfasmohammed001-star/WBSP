'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import WorkerLocationTracker from '@/components/WorkerLocationTracker';
import { Button } from '@/components/ui/Button';
import {
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    User,
    FileText,
    CheckCircle2,
    Star,
    MessageCircle,
    ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function WorkerActiveJob() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentJob, setCurrentJob] = useState<any>(null);
    const [status, setStatus] = useState<'open' | 'assigned' | 'in_progress' | 'completed'>('assigned');
    const [otpInput, setOtpInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingJob, setIsFetchingJob] = useState(true);

    useEffect(() => {
        if (user && user.userType !== 'worker') {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                const jobData = await jobService.getJobDetails(id);
                if (jobData) {
                    setCurrentJob(jobData);
                    setStatus(jobData.status || 'assigned');
                } else {
                    toast.error("Job not found");
                    navigate('/worker/history');
                }
            } catch (err) {
                console.error("Failed to fetch job", err);
                toast.error("Failed to load job details");
            } finally {
                setIsFetchingJob(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleAcceptJob = async () => {
        if (!user || !currentJob) return;
        setIsLoading(true);
        try {
            await jobService.assignWorker(currentJob.id, user.id);
            setStatus('assigned');
            toast.success("Job Accepted! Head to the location.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to accept job");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartJob = async () => {
        const pin = otpInput.replace(/\D/g, '');
        if (pin.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setIsLoading(true);
        try {
            const isVerified = await jobService.verifyJobStart(currentJob.id, pin);
            if (isVerified) {
                toast.success("Success! Job Timer Started.");
                setTimeout(() => {
                    setStatus('in_progress');
                    setIsLoading(false);
                }, 1000);
                return;
            } else {
                toast.error("Incorrect PIN. Ask customer to check their app.");
            }
        } catch (error) {
            console.error(error);
            toast.error("System error verifying PIN");
        }
        setIsLoading(false);
    };

    const handleFinishJob = async () => {
        if (!window.confirm("Are you sure this job is completed?")) return;

        try {
            await jobService.completeJob(currentJob.id);
            setStatus('completed');
            toast.success("Job Done! Milestone reached.");
            // We stay on the page now to see the completion details
        } catch (error) {
            console.error(error);
            toast.error("Error completing job");
        }
    };

    const customerReview = useMemo(() => {
        return currentJob?.reviews?.find((r: any) => r.reviewer_id === currentJob.customer_id);
    }, [currentJob]);

    if (isFetchingJob) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Retrieving Case Details</p>
            </div>
        );
    }

    if (!currentJob) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 dark">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/80 border border-border/50 hover:bg-secondary transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black tracking-tight">
                                {status === 'completed' ? 'Job Archive' : 'Active Case'}
                            </h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Reference #{currentJob.id.split('-')[0]}</p>
                        </div>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        status === 'completed' ? "bg-green-500/10 text-green-500" :
                            status === 'in_progress' ? "bg-blue-500/10 text-blue-500 animate-pulse" :
                                "bg-amber-500/10 text-amber-500"
                    )}>
                        {status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto px-6 pt-8 space-y-8"
            >
                {/* 1. Main Job Identity */}
                <section className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black leading-tight tracking-tight">{currentJob.title}</h2>
                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span>{currentJob.location_address || 'Job Site'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    <span>{currentJob.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                            <ShieldCheck className="h-7 w-7 text-primary" />
                        </div>
                    </div>

                    <div className="bg-secondary/20 border border-border/50 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-bold">Work Description</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                            {currentJob.description || "No detailed description provided for this work assignment."}
                        </p>
                    </div>
                </section>

                {/* 2. Customer Profile Section */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Customer Details</h3>
                    <div className="bg-card border border-border/50 rounded-3xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-secondary overflow-hidden border border-border/50 shadow-inner">
                                {currentJob.customer?.profile_image_url ? (
                                    <img src={currentJob.customer.profile_image_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-xl font-black tracking-tight">{currentJob.customer?.full_name || 'Verified Client'}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Top Client</span>
                                </div>
                            </div>
                        </div>
                        <button className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </div>
                </section>

                {/* 3. Job Timeline & Economics */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary/20 border border-border/50 rounded-3xl p-6 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 relative">
                                <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-border/50" />
                                <div className="h-4 w-4 rounded-full bg-primary border-4 border-background z-10 shrink-0 mt-1" />
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Job Posted</p>
                                    <p className="text-sm font-bold">{format(new Date(currentJob.created_at), 'PPPp')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-border/50" />
                                <div className="h-4 w-4 rounded-full bg-blue-500 border-4 border-background z-10 shrink-0 mt-1" />
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Assigned</p>
                                    <p className="text-sm font-bold">{format(new Date(currentJob.updated_at), 'PPPp')}</p>
                                </div>
                            </div>
                            {status === 'completed' && (
                                <div className="flex gap-4">
                                    <div className="h-4 w-4 rounded-full bg-green-500 border-4 border-background z-10 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase">Finished</p>
                                        <p className="text-sm font-bold">{format(new Date(currentJob.updated_at), 'PPPp')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Financial Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-primary/70 uppercase">Total Revenue</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-primary">${currentJob.budget}</span>
                                    <span className="text-xs font-bold text-primary/50 uppercase">USD</span>
                                </div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase">Payment Secured</span>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Feedback View (If completed and has review) */}
                {status === 'completed' && customerReview && (
                    <section className="space-y-4 pb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Customer Review</h3>
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-4 w-4", i < customerReview.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground")} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground">{format(new Date(customerReview.created_at), 'MMMM do')}</span>
                            </div>
                            <p className="italic text-foreground/80 font-medium">"{customerReview.review_text}"</p>
                        </div>
                    </section>
                )}

                {/* Status Specific Action Areas */}
                {status === 'open' && (
                    <section className="pt-4 flex flex-col gap-3">
                        <Button variant="premium" size="lg" className="w-full h-14" onClick={handleAcceptJob} isLoading={isLoading}>
                            Accept & Start Navigation
                        </Button>
                        <Button variant="outline" size="lg" className="w-full h-14 border-destructive/20 text-destructive" onClick={() => navigate('/worker/history')}>
                            Decline Offer
                        </Button>
                    </section>
                )}

                {status === 'assigned' && (
                    <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-foreground">Worker Verification</h3>
                            <p className="text-muted-foreground text-sm font-medium">
                                Arrived at the location? Ask the customer for the secure start PIN.
                            </p>
                        </div>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="0 0 0 0"
                            maxLength={4}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center text-5xl font-mono font-bold tracking-[0.5em] bg-secondary border-2 border-border/50 rounded-2xl py-6 focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                        />
                        <Button variant="premium" size="lg" className="w-full h-16 text-lg" onClick={handleStartJob} isLoading={isLoading}>
                            Verify & Start Work <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </section>
                )}

                {status === 'in_progress' && (
                    <section className="space-y-6 pt-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 text-center space-y-6">
                            <div className="relative h-20 w-20 mx-auto">
                                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                                <div className="relative h-full w-full bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Clock className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-blue-400">Work Mode Active</h3>
                                <p className="text-blue-400/70 text-sm font-medium">Live duration tracking and updates enabled.</p>
                            </div>
                        </div>
                        <Button variant="destructive" size="lg" className="w-full h-16 text-lg rounded-2xl shadow-lg shadow-red-500/20" onClick={handleFinishJob}>
                            Complete Milestone
                        </Button>
                        <WorkerLocationTracker jobId={currentJob.id} isJobActive={true} />
                    </section>
                )}

                {status === 'completed' && (
                    <section className="pt-8 text-center">
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-4">Case Successfully Closed</p>
                        <Button variant="secondary" size="lg" className="rounded-2xl px-10 font-bold" onClick={() => navigate('/worker/history')}>
                            Return to History
                        </Button>
                    </section>
                )}
            </motion.div>
        </div>
    );
}
