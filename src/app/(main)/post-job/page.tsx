'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    ChevronLeft,
    ChevronRight,
    Upload,
    Calendar,
    Zap,
    CheckCircle2,
    Mic,
    X,
    Play,
    Pause,
    Trash2,
    MapPin,
    Clock,
    Info,
    Image as ImageIcon,
    Sparkles,
    Loader2,
    Activity,
    Target,
    Shield,
    Radar,
    Navigation,
    DollarSign
} from 'lucide-react';
import { CategorySelector } from '@/components/jobs/CategorySelector';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import { diagnosticService } from '@/services/diagnosticService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';

export default function PostJob() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || '';

    // Auth & Loading State
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Interfaces
    interface JobFormData {
        category: string;
        title: string;
        description: string;
        address: string;
        budget: string;
        date: string;
        time: string;
        urgency: string;
        jobType: string;
        images: string[];
        files: File[];
        audioNote: Blob | null;
    }

    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<JobFormData>({
        category: initialCategory,
        title: '',
        description: '',
        address: '',
        budget: '',
        date: '',
        time: '',
        urgency: 'Medium',
        jobType: 'scheduled',
        images: [],
        files: [],
        audioNote: null
    });
    const [isDiagnosing, setIsDiagnosing] = useState(false);

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // Recording logic...
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handlePostClick = async () => {
        if (!user) {
            toast.error("Authentication required for mission deployment.");
            navigate('/login?redirect=/post-job');
            return;
        }
        submitJob();
    };

    const submitJob = async () => {
        setIsSubmitting(true);
        try {
            await jobService.createJob(user!.id, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                job_type: formData.jobType as 'scheduled' | 'spot',
                budget: parseFloat(formData.budget) || 0,
                urgency_level: formData.urgency,
                location_address: formData.address,
                date: formData.date,
                time: formData.time
            });
            toast.success("Mission Deployed Successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Deployment failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans overflow-hidden pb-40">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-purple-600/5 bottom-[20%] -right-[10%] scale-150" />
            </div>

            {/* Header / HUD Navigation */}
            <header className="sticky top-0 z-50 glass-obsidian border-b border-white/5 px-8 py-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={step > 1 ? handleBack : () => navigate(-1)}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors shadow-2xl"
                    >
                        <ChevronLeft className="w-6 h-6 text-white/70" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase">Initiate Deployment</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Phase {step}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Vector Syncing...</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Sync Integrity</div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-2xl mx-auto w-full relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-12"
                    >
                        {/* Step 1: Sector Identification */}
                        {step === 1 && (
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <h2 className="text-3xl font-black tracking-tighter uppercase">Target Sector</h2>
                                    </div>
                                    <p className="text-white/40 font-medium text-sm leading-relaxed max-w-md italic">Identify the primary technical sector for this deployment to optimize operatives matching.</p>
                                </section>
                                <div className="p-2 glass-obsidian border border-white/5 rounded-[3rem]">
                                    <CategorySelector
                                        selectedCategory={formData.category}
                                        onSelect={(cat: string) => setFormData({ ...formData, category: cat })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Mission Briefing */}
                        {step === 2 && (
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center gap-4 mb-3">
                                        <Activity className="w-6 h-6 text-primary" />
                                        <h2 className="text-3xl font-black tracking-tighter uppercase">Mission Briefing</h2>
                                    </div>
                                    <p className="text-white/40 font-medium text-sm italic">Provide higher fidelity details to reduce synchronization latency with operatives.</p>
                                </section>

                                <div className="space-y-6">
                                    <Card className="glass-obsidian p-8 border-white/5 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <Target className="w-20 h-20 text-white" />
                                        </div>
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Primary Objective</label>
                                        <Input
                                            placeholder="Specify deployment title..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="bg-white/5 h-16 border-white/10 focus:border-primary/50 text-xl font-black tracking-tight"
                                        />
                                    </Card>

                                    <Card className="glass-obsidian p-8 border-white/5 relative group">
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Operational Narrative</label>
                                        <textarea
                                            className="w-full min-h-[160px] bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-lg font-medium text-white/70 placeholder:text-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none resize-none"
                                            placeholder="Detail mission requirements and restorative goals..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />

                                        <div className="flex justify-end mt-6">
                                            <button className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
                                                <Mic className="w-4 h-4" />
                                                Voice Briefing Uplink
                                            </button>
                                        </div>
                                    </Card>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Visual Assets</label>
                                            <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-lg">AI Ready</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-[4/3] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                                            >
                                                <ImageIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Add Vector Hub</span>
                                            </div>
                                            <button className="aspect-[4/3] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                                <Upload className="w-8 h-8 mb-2" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Bulk Import</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Deployment Zone */}
                        {step === 3 && (
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center gap-4 mb-3">
                                        <MapPin className="w-6 h-6 text-primary" />
                                        <h2 className="text-3xl font-black tracking-tighter uppercase">Deployment Zone</h2>
                                    </div>
                                    <p className="text-white/40 font-medium text-sm italic">Synchronizing spatial vectors for operative navigation protocol.</p>
                                </section>

                                <div className="space-y-6">
                                    <Card className="glass-obsidian border border-white/5 p-2 rounded-[3rem] overflow-hidden">
                                        <div className="h-96 rounded-[2.8rem] bg-[#0a0f1d] relative flex items-center justify-center border border-white/5 group">
                                            <Radar className="w-16 h-16 text-primary/20 group-hover:text-primary transition-colors animate-pulse" />
                                            <div className="absolute bottom-8 left-8 right-8">
                                                <div className="glass-obsidian p-6 border border-white/10 rounded-3xl shadow-2xl">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <Navigation className="w-5 h-5 text-primary" />
                                                        <Input
                                                            placeholder="Target Address Matrix..."
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-sm font-black tracking-tight"
                                                        />
                                                    </div>
                                                    <Button className="w-full h-14 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex gap-3">
                                                        <Shield className="w-4 h-4" />
                                                        Activate Proximity Sync
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Resource Allocation */}
                        {step === 4 && (
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center gap-4 mb-3">
                                        <DollarSign className="w-6 h-6 text-primary" />
                                        <h2 className="text-3xl font-black tracking-tighter uppercase">Resource Allocation</h2>
                                    </div>
                                    <p className="text-white/40 font-medium text-sm italic">Finalize the financial matrix and urgency parameters for this deployment.</p>
                                </section>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { id: 'scheduled', label: 'Tactical Schedule', icon: Calendar },
                                            { id: 'spot', label: 'Pulse Deployment', icon: Zap }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setFormData({ ...formData, jobType: type.id })}
                                                className={cn(
                                                    "p-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-5 transition-all shadow-2xl group",
                                                    formData.jobType === type.id
                                                        ? "border-primary bg-primary/10 text-primary shadow-primary/20"
                                                        : "border-white/5 bg-white/5 text-white/30 hover:bg-white/10"
                                                )}
                                            >
                                                <type.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", formData.jobType === type.id ? "text-primary scale-110" : "text-white/20")} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <Card className="glass-obsidian p-10 border-white/5 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <Zap className="w-24 h-24 text-primary" />
                                        </div>
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 block text-center">Budget Threshold</label>
                                        <div className="relative flex justify-center items-baseline gap-4">
                                            <span className="text-3xl font-black text-white/20">$</span>
                                            <input
                                                type="number"
                                                className="bg-transparent text-8xl font-black text-center text-white tracking-tighter outline-none focus:text-primary transition-colors tabular-nums w-full max-w-xs"
                                                placeholder="0"
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                            />
                                        </div>
                                    </Card>

                                    {user ? (
                                        <div className="p-6 glass-obsidian border border-primary/20 rounded-[2rem] flex items-center justify-between shadow-2xl">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-primary border-4 border-[#020408] flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-primary/40 leading-none">
                                                    {user.fullName?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white tracking-tight uppercase">{user.fullName}</p>
                                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">Alpha Client Signed</div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full h-20 rounded-[2rem] bg-white/5 border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10"
                                            onClick={() => navigate('/login?redirect=/post-job')}
                                        >
                                            Sign Intelligence Protocol to Deploy
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Tactical Command Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-8 glass-obsidian border-t border-white/10 z-[100] flex justify-center">
                <div className="w-full max-w-4xl flex gap-6">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            className="flex-1 h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] border-2 border-white/5 hover:bg-white/5 transition-all text-white/40"
                            onClick={handleBack}
                        >
                            Review Matrix
                        </Button>
                    )}

                    {step < 4 ? (
                        <Button
                            className="flex-[2] h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white shadow-2xl"
                            onClick={handleNext}
                            disabled={step === 1 && !formData.category}
                        >
                            Next Vector
                        </Button>
                    ) : (
                        <Button
                            className="flex-[2] h-20 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] bg-primary hover:bg-primary/90 transition-all text-white shadow-[0_0_50px_rgba(37,99,235,0.4)]"
                            onClick={handlePostClick}
                            isLoading={isSubmitting}
                        >
                            Confirm Deployment
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
