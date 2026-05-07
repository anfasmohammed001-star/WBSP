'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Zap, Shield, Target, Activity, Cpu,
    Globe, Lock, Search, Sparkles, BarChart3,
    Box, Navigation, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Module {
    id: string;
    label: string;
    icon: any;
    color: string;
    route?: string;
}

interface SystemHubProps {
    type: 'customer' | 'worker';
}

export default function SystemHub({ type }: SystemHubProps) {
    const navigate = useNavigate();

    const customerModules: Module[] = [
        { id: 'ai-estimate', label: 'AI Estimator', icon: Sparkles, color: 'text-primary', route: '/customer/ai-estimator' },
        { id: 'market-insights', label: 'Market Feed', icon: BarChart3, color: 'text-emerald-500', route: '/jobs' },
        { id: 'safety-vault', label: 'Safety Hub', icon: Shield, color: 'text-amber-500', route: '/safety' },
        { id: 'identity-sync', label: 'Client ID', icon: Lock, color: 'text-purple-500', route: '/customer/profile' },
        { id: 'support-link', label: 'Direct Uplink', icon: Activity, color: 'text-blue-500', route: '/support' },
    ];

    const workerModules: Module[] = [
        { id: 'rapid-deployment', label: 'Rapid Scan', icon: Zap, color: 'text-primary', route: '/worker/rapid-scan' },
        { id: 'gear-check', label: 'Gear Diag', icon: Cpu, color: 'text-emerald-500', route: '/worker/academy' },
        { id: 'vector-path', label: 'Vector Path', icon: Navigation, color: 'text-amber-500', route: '/worker/schedule' },
        { id: 'academy-sync', label: 'Academy', icon: Target, color: 'text-purple-500', route: '/worker/academy' },
        { id: 'secure-vault', label: 'Yield Hub', icon: Box, color: 'text-blue-500', route: '/worker/wallet' },
    ];

    const modules = type === 'customer' ? customerModules : workerModules;

    return (
        <div className="w-full py-4 mb-2 overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Tactical System Hub</span>
                </div>
                <button className="p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all">
                    <Settings className="w-3.5 h-3.5 text-white/40" />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-10">
                {modules.map((module, idx) => (
                    <motion.button
                        key={module.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => module.route && navigate(module.route)}
                        className="min-w-[100px] flex flex-col items-center gap-3 p-4 glass-obsidian border border-white/5 rounded-[1.8rem] group hover:border-primary/20 transition-all shadow-2xl"
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-inner",
                            module.color
                        )}>
                            <module.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors text-center whitespace-nowrap">
                            {module.label}
                        </span>

                        {/* Decorative progress bit */}
                        <div className="w-8 h-0.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary/40"
                                animate={{ width: ['20%', '100%', '20%'] }}
                                transition={{ repeat: Infinity, duration: 4, delay: idx * 0.5 }}
                            />
                        </div>
                    </motion.button>
                ))}

                {/* Add New Module Placeholder */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="min-w-[100px] flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-white/5 rounded-[1.8rem] text-white/10 hover:border-primary/20 hover:text-primary transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-[7px] font-black uppercase tracking-widest">New Protocol</span>
                </motion.button>
            </div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>;
}
