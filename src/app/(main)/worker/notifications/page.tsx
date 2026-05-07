'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, CheckCircle2, AlertTriangle, Briefcase, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function WorkerNotifications() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'alerts' | 'offers'>('all');

    const notifications = [
        {
            id: 1,
            type: 'offer',
            title: 'New Job Invitation',
            message: 'Alex S. invited you to apply for "Luxury Apt Repair"',
            time: '2 mins ago',
            read: false,
            icon: Briefcase,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            id: 2,
            type: 'alert',
            title: 'Urgent: Safety Update',
            message: 'New safety protocols for electrical work in effect.',
            time: '1 hour ago',
            read: false,
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        },
        {
            id: 3,
            type: 'system',
            title: 'Payment Received',
            message: 'You received $120.00 for "Kitchen Sink Fix".',
            time: 'Yesterday',
            read: true,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        }
    ];

    const filteredNotifs = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter || (filter === 'offers' && n.type === 'offer'));

    return (
        <div className="min-h-screen bg-[#020817] text-white pb-24">
            {/* Header */}
            <header className="bg-[#020817]/90 backdrop-blur-xl sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold">Notifications</h1>
                </div>
                <button className="text-xs font-bold text-blue-400 hover:text-blue-300">
                    Mark all read
                </button>
            </header>

            {/* Filter Tabs */}
            <div className="px-6 py-4 flex gap-4 overflow-x-auto border-b border-white/5">
                {['all', 'alerts', 'offers'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border",
                            filter === f
                                ? "bg-white/10 border-white/20 text-white shadow-lg shadow-white/5"
                                : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="p-4 space-y-3">
                {filteredNotifs.map(notif => {
                    const Icon = notif.icon;
                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "p-4 rounded-3xl border flex gap-4 relative overflow-hidden group transition-all",
                                notif.read
                                    ? "bg-transparent border-white/5 opacity-60"
                                    : "bg-white/5 border-white/10 shadow-lg shadow-black/20 hover:bg-white/10"
                            )}
                        >
                            {!notif.read && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            )}

                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", notif.bg)}>
                                <Icon className={cn("w-6 h-6", notif.color)} />
                            </div>

                            <div className="flex-1 pr-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                                    <span className="text-[10px] font-bold text-slate-500">{notif.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{notif.message}</p>

                                {notif.type === 'offer' && (
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500 border-0">Accept</Button>
                                        <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 hover:bg-white/5 text-slate-300">Decline</Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
