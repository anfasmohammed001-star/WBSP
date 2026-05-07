'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, DollarSign, Star, ThumbsUp, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function JobComplete() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [jobDetails, setJobDetails] = useState<{ budget: number } | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchJob = async () => {
            const { data } = await supabase.from('jobs').select('budget').eq('id', id).single();
            if (data) setJobDetails(data);
        };
        fetchJob();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#020817] z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: '100vh', opacity: [0, 1, 0] }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-2 h-2 bg-blue-500 rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Job Complete!</h1>
                    <p className="text-slate-400 font-medium">Great work! You crushed it.</p>
                </div>

                {/* Earnings Card */}
                <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 mb-6 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                        <span className="text-slate-400 font-bold text-sm">Total Earnings</span>
                        <div className="flex items-center gap-1 text-green-400 font-black text-2xl">
                            <DollarSign className="w-6 h-6" />
                            <span>{jobDetails?.budget?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>Job Budget</span>
                            <span className="text-slate-300">${jobDetails?.budget?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>Service Fee</span>
                            <span className="text-slate-300 text-green-500">Waived</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 mb-8 text-center">
                    <h3 className="font-bold text-white mb-4">Rate the Client</h3>
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    rating >= star ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white/5 text-slate-600 hover:bg-white/10"
                                )}
                            >
                                <Star className={cn("w-5 h-5", rating >= star && "fill-current")} />
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-colors">Friendly</button>
                        <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-colors">Clear Instructions</button>
                    </div>
                </div>

                <Button
                    onClick={() => navigate('/worker/dashboard')}
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10"
                >
                    Back to Dashboard
                </Button>
            </motion.div>
        </div>
    );
}
