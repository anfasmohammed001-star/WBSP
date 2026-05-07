'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, Sparkles, TrendingUp, Users, MapPin, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const suggestions = [
        { id: '1', title: 'Find Plumbers in Manhattan', type: 'Service', icon: Search },
        { id: '2', title: 'Top Rated Electricians', type: 'Specialist', icon: Users },
        { id: '3', title: 'Urgent Cleaning Needed', type: 'Job', icon: TrendingUp },
        { id: '4', title: 'WBSP Elite Benefits', type: 'Info', icon: Sparkles },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                // Toggle search logic here if needed, but we pass isOpen from prop
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-6"
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.95 }}
                        className="relative w-full max-w-2xl bg-slate-900/50 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="relative flex items-center gap-4 mb-8">
                                <Search className="w-8 h-8 text-primary" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search the WBSP Matrix..."
                                    className="w-full bg-transparent border-none text-2xl font-black text-white focus:outline-none placeholder:text-white/20"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30"
                                    >
                                        <Mic className="w-6 h-6" />
                                    </motion.button>
                                    <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <X className="w-6 h-6 text-white/40" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Recommended Vectors</span>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        <span className="text-[9px] font-black text-primary uppercase">AI Powered</span>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {suggestions.map((item) => (
                                        <button
                                            key={item.id}
                                            className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group text-left"
                                            onClick={() => {
                                                navigate('/jobs');
                                                onClose();
                                            }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.type}</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Command className="w-4 h-4 text-white" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black text-white/40 border border-white/10">ESC</kbd>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Close</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black text-white/40 border border-white/10">↵</kbd>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Network Active</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
