
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Sparkles, CheckCircle2, Trophy, Loader2, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { portfolioService, PortfolioAnalysis } from '@/services/portfolioService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function AIPortfolioBuilder() {
    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<PortfolioAnalysis | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setResult(null);
        }
    };

    const generatePortfolio = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            const analysis = await portfolioService.analyzeWorkImage(image, "General Skilled Labor");
            setResult(analysis);
            toast.success("AI Portfolio Item Generated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze work.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-[#020617] min-h-screen pb-20 text-slate-100 font-sans">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-400">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h1 className="text-lg font-black tracking-tight uppercase">AI Portfolio Builder</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-6 space-y-8 max-w-md mx-auto">
                {!image ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] mb-8 transform -rotate-3">
                                <Camera className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black mb-3 leading-tight">Vouch For Your Work</h2>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Let AI analyze your project photos to create professional portfolio items and unlock "Verified Skill" badges.</p>
                        </div>

                        <ul className="space-y-4 text-left">
                            {[
                                { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: "AI-generated professional descriptions" },
                                { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: "Technical skill extraction from images" },
                                { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: "Shareable trust-link for customers" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    {item.icon}
                                    <span className="text-xs font-bold text-slate-300">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl"
                        >
                            UPLOAD WORK PHOTO
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
                    <div className="space-y-6 pb-12">
                        <div className="relative group rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-3xl">
                            <img src={image} alt="Upload" className="w-full h-96 object-cover" />
                            {!result && !isAnalyzing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setImage(null)}
                                        className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            )}
                        </div>

                        {!result ? (
                            <Button
                                onClick={generatePortfolio}
                                disabled={isAnalyzing}
                                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        AI ANALYZING SKILLS...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        GENERATE AI PORTFOLIO
                                    </>
                                )}
                            </Button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Score Badge */}
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-[2.5rem] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                                            {result.qualityScore}%
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Quality Score</p>
                                            <p className="text-xl font-black">Industrial Grade</p>
                                        </div>
                                    </div>
                                    <Trophy className="w-8 h-8 text-amber-500" />
                                </div>

                                {/* Content */}
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                                    <div>
                                        <h3 className="font-black text-2xl text-white mb-2 leading-tight">{result.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{result.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verified Skills Extraction</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.skillsIdentified.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-[10px] uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Differentiating Features</p>
                                        <ul className="space-y-2">
                                            {result.highlightFeatures.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 h-14 rounded-2xl bg-white text-black font-black uppercase tracking-tight flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Link
                                    </Button>
                                    <Button
                                        onClick={() => { setImage(null); setResult(null); }}
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl border-white/10 text-slate-400 font-bold uppercase"
                                    >
                                        New Upload
                                    </Button>
                                </div>

                                <button
                                    onClick={() => navigate('/worker/dashboard')}
                                    className="w-full py-4 text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    Back to Dashboard <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

