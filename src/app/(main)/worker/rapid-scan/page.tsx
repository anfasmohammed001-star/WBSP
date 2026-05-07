'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Radar, Target, Zap,
    Navigation, Activity, Shield, Search,
    Cpu, Globe, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function RapidScan() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [matches, setMatches] = useState<any[]>([]);

    const handleScan = () => {
        setScanning(true);
        setMatches([]);
        setTimeout(() => {
            setScanning(false);
            setMatches([
                { id: 1, title: 'HVAC VENTILATION SYNC', distance: '0.4km', payload: '$420', tech: 'Alpha' },
                { id: 2, title: 'HYDRAULIC PRE-CHECK', distance: '1.2km', payload: '$280', tech: 'Sigma' },
                { id: 3, title: 'NETWORK CONDUIT REPAIR', distance: '2.5km', payload: '$550', tech: 'Delta' }
            ]);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white pb-32 font-sans overflow-hidden">
            {/* Ambient Background */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/20 top-0 left-0 scale-150 rounded-full blur-[120px]" />
                <div className="blob bg-blue-600/10 bottom-0 right-0 scale-150 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 glass-obsidian border-b border-white/5 px-8 py-8 flex items-center gap-6">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10"
                >
                    <ChevronLeft className="w-6 h-6 text-white/70" />
                </motion.button>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Rapid Vector Scan</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Sector Analysis</p>
                </div>
            </header>

            <main className="p-8 max-w-2xl mx-auto w-full relative z-10">
                <div className="flex flex-col items-center">
                    {/* Radar UI */}
                    <div className="relative w-72 h-72 mb-12">
                        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                        <div className="absolute inset-8 rounded-full border-2 border-white/5" />
                        <div className="absolute inset-16 rounded-full border border-white/5" />

                        {/* Scanning Sweep */}
                        {scanning && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                style={{ transformOrigin: 'center' }}
                            />
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                            <Radar className={cn("w-12 h-12 transition-all", scanning ? "text-primary animate-pulse" : "text-white/20")} />
                        </div>

                        {/* Animated Blips */}
                        {matches.length > 0 && matches.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,1)]"
                                style={{
                                    top: `${20 + i * 25}%`,
                                    left: `${30 + i * 20}%`
                                }}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleScan}
                        disabled={scanning}
                        variant="premium"
                        size="xl"
                        className="w-full h-20 rounded-[2rem] shadow-[0_0_50px_rgba(37,99,235,0.3)]"
                    >
                        {scanning ? 'PINGING NETWORK...' : 'INITIATE SECTOR SCAN'}
                    </Button>

                    <div className="w-full mt-12 space-y-6">
                        <AnimatePresence>
                            {matches.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="glass-obsidian border-white/5 p-6 hover:border-primary/30 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                                    <Target className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight uppercase group-hover:text-primary transition-colors">{job.title}</h4>
                                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/20">
                                                        <span>{job.distance}</span>
                                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                                        <span className="text-primary">{job.tech} TAG</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-white tabular-nums">{job.payload}</div>
                                                <span className="text-[8px] font-black uppercase text-white/10 tracking-widest">Est. Payload</span>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
