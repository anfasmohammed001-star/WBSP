'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coffee, Moon, Sun, Clock, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function BalanceTools() {
    const navigate = useNavigate();
    const [focusMode, setFocusMode] = useState(false);

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Work-Life Balance</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">
                {/* Focus Mode Toggle */}
                <div className={cn("rounded-3xl p-6 transition-all duration-500 shadow-xl", focusMode ? "bg-indigo-600 text-white" : "bg-card border border-border")}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-black mb-1">Focus Mode</h2>
                            <p className={cn("text-sm", focusMode ? "opacity-90" : "text-muted-foreground")}>
                                {focusMode ? "Notifications silenced." : "Distractions allowed."}
                            </p>
                        </div>
                        <button
                            onClick={() => setFocusMode(!focusMode)}
                            className={cn("h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95", focusMode ? "bg-white text-indigo-600" : "bg-secondary text-foreground")}
                        >
                            <Power className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Time Off Planner */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Schedule Time Off</h3>
                    <div className="bg-secondary/30 rounded-2xl p-4 border border-border space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20">
                            <div className="flex items-center space-x-3">
                                <Sun className="h-5 w-5 text-orange-500" />
                                <span className="font-bold">Vacation Mode</span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">Off</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <div className="flex items-center space-x-3">
                                <Moon className="h-5 w-5 text-indigo-500" />
                                <span className="font-bold">Quiet Hours</span>
                            </div>
                            <span className="text-xs font-bold text-primary">8PM - 7AM</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20">
                            <div className="flex items-center space-x-3">
                                <Coffee className="h-5 w-5 text-amber-700" />
                                <span className="font-bold">Lunch Break</span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">12PM - 1PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
