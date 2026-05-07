'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bot, MessageSquare, Receipt, CalendarClock, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function TaskAutomation() {
    const navigate = useNavigate();

    // Mock state for toggles
    const [automations, setAutomations] = useState([
        {
            id: 1,
            title: 'Auto-Reply to Messages',
            desc: 'Send a "drivng" or "on job" response when busy.',
            icon: MessageSquare,
            active: true,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            id: 2,
            title: 'Instant Invoicing',
            desc: 'Generate and send invoice immediately upon job completion.',
            icon: Receipt,
            active: false,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            id: 3,
            title: 'Shift Reminders',
            desc: 'Alert me 1 hour before scheduled start time.',
            icon: CalendarClock,
            active: true,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ]);

    const toggleAutomation = (id: number) => {
        setAutomations(prev => prev.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
        ));
    };

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Automation</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Bot className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-xl">Work Smarter</h2>
                            <p className="text-sm opacity-90">Let AI handle the boring stuff.</p>
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 flex justify-between items-center text-sm font-medium">
                        <span>Time Saved This Week</span>
                        <span className="font-bold text-green-300">2.5 Hours</span>
                    </div>
                </div>

                {/* Automation List */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Active Rules</h3>
                    <div className="space-y-4">
                        {automations.map(item => (
                            <div key={item.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-4 flex-1 pr-4">
                                    <div className={cn("p-3 rounded-xl shrink-0", item.bg)}>
                                        <item.icon className={cn("h-6 w-6", item.color)} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleAutomation(item.id)}
                                    className={cn("h-8 w-14 rounded-full p-1 transition-colors relative shrink-0", item.active ? "bg-primary" : "bg-secondary")}
                                >
                                    <div className={cn("h-6 w-6 bg-white rounded-full shadow-md transition-transform", item.active ? "translate-x-6" : "translate-x-0")} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add New */}
                <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground font-bold flex items-center justify-center hover:bg-secondary/50 transition-colors">
                    <Power className="h-5 w-5 mr-2" />
                    Create Custom Rule
                </button>

            </div>
        </div>
    );
}
