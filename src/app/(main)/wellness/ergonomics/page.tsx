
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, ShieldCheck, AlertCircle, RefreshCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ergonomicsService, ErgonomicsAnalysis } from '@/services/ergonomicsService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ErgonomicsCoach() {
    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ErgonomicsAnalysis | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setResult(null);
        }
    };

    const startAnalysis = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            // In a real app, we'd upload to Supabase storage first and get a public URL
            // For now, we'll simulate or use the local URL if the service handles it (GPT-4o actually needs a public URL or base64)
            // Let's simulate a delay for "processing"
            const analysis = await ergonomicsService.analyzePosture(image, "General Laborer");
            setResult(analysis);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-[#0f172a] min-h-screen pb-20 text-slate-100 font-sans">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-10 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-400">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <h1 className="text-lg font-black tracking-tight uppercase">AI Ergonomics Coach</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-6 space-y-8 max-w-md mx-auto">
                {!image ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
                                <Camera className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-black mb-2">Check Your Stance</h2>
                            <p className="text-slate-400 text-sm">Take a photo of yourself while working to get AI-powered posture correction and injury prevention tips.</p>
                        </div>

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg"
                        >
                            TAKE / UPLOAD PHOTO
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative group rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
                            <img src={image} alt="Upload" className="w-full h-80 object-cover" />
                            {!result && !isAnalyzing && (
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {!result ? (
                            <Button
                                onClick={startAnalysis}
                                disabled={isAnalyzing}
                                className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ANALYZING POSTURE...
                                    </>
                                ) : 'START AI ANALYSIS'}
                            </Button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className={cn(
                                    "p-6 rounded-3xl border flex items-center gap-4",
                                    result.riskLevel === 'Low' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        result.riskLevel === 'Medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                            "bg-red-500/10 border-red-500/20 text-red-400"
                                )}>
                                    {result.riskLevel === 'Low' ? <ShieldCheck className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Injury Risk Level</p>
                                        <p className="text-2xl font-black">{result.riskLevel} Risk</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                                    <h3 className="font-black text-lg text-emerald-400 uppercase tracking-tight">Postural Assessment</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{result.assessment}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                                        <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Recommended Stretches</h3>
                                        <div className="space-y-2">
                                            {result.suggestedStretches.map((stretch, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-200">{stretch}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => { setImage(null); setResult(null); }}
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl border-white/10 text-slate-400 font-bold"
                                >
                                    TEST AGAIN
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

