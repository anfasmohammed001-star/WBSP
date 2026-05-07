import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Briefcase, Calendar, Clock, MapPin, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function WorkPreferences() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'freelance' | 'fulltime'>('freelance');

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Work Style</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-8">

                {/* Mode Switcher */}
                <div className="bg-secondary p-1 rounded-2xl flex">
                    <button
                        onClick={() => setMode('freelance')}
                        className={cn("flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm", mode === 'freelance' ? "bg-background text-primary" : "text-muted-foreground")}
                    >
                        Freelance
                    </button>
                    <button
                        onClick={() => setMode('fulltime')}
                        className={cn("flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm", mode === 'fulltime' ? "bg-background text-primary" : "text-muted-foreground")}
                    >
                        Full-Time
                    </button>
                </div>

                {mode === 'freelance' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 rounded-3xl text-white shadow-lg">
                            <h2 className="font-black text-2xl mb-2">Be Your Own Boss</h2>
                            <p className="text-sm font-medium opacity-90">Set your own rates, pick your own hours, and choose clients you love.</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Availability</h3>
                            {['Weekdays', 'Weekends', 'Evenings'].map(time => (
                                <div key={time} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-bold text-sm">{time}</span>
                                    </div>
                                    <div className="h-6 w-11 bg-green-500 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-3xl text-white shadow-lg">
                            <h2 className="font-black text-2xl mb-2">Stability & Benefits</h2>
                            <p className="text-sm font-medium opacity-90">Find consistent long-term contracts with guaranteed hours and perks.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-card border border-border rounded-2xl">
                                <Globe className="h-10 w-10 text-blue-500 p-2 bg-blue-500/10 rounded-xl" />
                                <div>
                                    <h4 className="font-bold text-sm">Remote Only</h4>
                                    <p className="text-xs text-muted-foreground">Work from anywhere</p>
                                </div>
                                <div className="ml-auto h-6 w-11 bg-secondary rounded-full relative">
                                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-card border border-border rounded-2xl">
                                <MapPin className="h-10 w-10 text-red-500 p-2 bg-red-500/10 rounded-xl" />
                                <div>
                                    <h4 className="font-bold text-sm">Max Commute</h4>
                                    <p className="text-xs text-muted-foreground">Up to 25 miles</p>
                                </div>
                                <ChevronLeft className="ml-auto h-5 w-5 rotate-180 text-muted-foreground" />
                            </div>
                        </div>

                        <button className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black shadow-lg">
                            Browse Full-Time Roles
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
