'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AvailabilityCalendar() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Mock Next 7 Days
    const days = [
        { date: 18, day: 'Tue', slots: 5 },
        { date: 19, day: 'Wed', slots: 2 },
        { date: 20, day: 'Thu', slots: 8 },
        { date: 21, day: 'Fri', slots: 0 }, // Booked
        { date: 22, day: 'Sat', slots: 12 },
        { date: 23, day: 'Sun', slots: 4 },
        { date: 24, day: 'Mon', slots: 6 },
    ];

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="p-4 flex items-center space-x-2 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-black">Live Availability</h1>
            </div>

            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">January 2025</h2>
                    <div className="flex space-x-2">
                        <button className="p-1 rounded-full bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
                        <button className="p-1 rounded-full bg-secondary"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                </div>

                {/* Days Strip */}
                <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                    {days.map((d) => (
                        <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            disabled={d.slots === 0}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl border-2 transition-all",
                                selectedDate === d.date
                                    ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md"
                                    : d.slots === 0
                                        ? "border-border bg-secondary/50 opacity-50 cursor-not-allowed"
                                        : "border-border bg-card hover:border-primary/50"
                            )}
                        >
                            <span className="text-xs font-bold opacity-80">{d.day}</span>
                            <span className="text-xl font-black">{d.date}</span>
                            <div className="mt-1 flex items-center space-x-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full", d.slots > 4 ? "bg-green-500" : d.slots > 0 ? "bg-yellow-500" : "bg-red-500")} />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Slots Grid */}
                {selectedDate && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4">Available Slots</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map((time, i) => (
                                <button key={time} className="p-4 bg-card border border-border rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-secondary transition-colors">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{time}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-6">
                            * Times are in your local timezone (GMT+5:30)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
