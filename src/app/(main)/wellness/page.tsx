import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Music, Leaf, Coffee, Smile, Moon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function WellnessHub() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('relax');

    const tools = [
        { id: 1, name: 'Meditation', desc: '5 min breathing', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { id: 2, name: 'Stretching', desc: 'Back relief', icon: Leaf, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 3, name: 'Focus', desc: 'White noise', icon: Music, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h1 className="text-lg font-black">Wellness</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">
                {/* Mood Check */}
                <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl p-6 text-white shadow-lg text-center">
                    <h2 className="font-black text-xl mb-4">How are you feeling?</h2>
                    <div className="flex justify-center space-x-4">
                        {['😫', '😐', '🙂', '😄'].map((emoji, i) => (
                            <button key={i} className="text-3xl hover:scale-125 transition-transform bg-white/20 h-14 w-14 rounded-full flex items-center justify-center backdrop-blur-sm">
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Ergonomics Coach Link */}
                <div onClick={() => navigate('/wellness/ergonomics')} className="cursor-pointer bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl flex items-center justify-between group hover:bg-emerald-500/20 transition-all">
                    <div className="flex items-center space-x-4">
                        <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-100 uppercase tracking-tight">AI Ergonomics Coach</h4>
                            <p className="text-xs text-slate-400">Postural analysis & injury prevention</p>
                        </div>
                    </div>
                </div>

                {/* Quick Tools */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Quick Relief</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {tools.map(tool => (
                            <button key={tool.id} className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
                                <div className={cn("mb-2 p-3 rounded-full", tool.bg)}>
                                    <tool.icon className={cn("h-6 w-6", tool.color)} />
                                </div>
                                <span className="font-bold text-sm">{tool.name}</span>
                                <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daily Tip */}
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 p-4 rounded-2xl flex items-start space-x-4">
                    <div className="bg-orange-500/20 p-2 rounded-xl shrink-0">
                        <Coffee className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm mb-1">Stay Hydrated</h4>
                        <p className="text-xs text-orange-600/80 dark:text-orange-300">
                            Physical labor requires plenty of water. Aim for a glass every hour on site.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
