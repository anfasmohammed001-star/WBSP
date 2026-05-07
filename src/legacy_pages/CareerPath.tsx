import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Star, Award, ShieldCheck, Lock, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function CareerPath() {
    const navigate = useNavigate();

    const levels = [
        {
            id: 'apprentice',
            title: 'Apprentice',
            icon: Star,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            current: false,
            completed: true,
            requirements: ['Complete Profile', 'Pass Background Check']
        },
        {
            id: 'pro',
            title: 'Professional',
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            current: true,
            completed: false,
            requirements: ['20 Jobs Completed', '4.5+ Rating', 'Verify Skills']
        },
        {
            id: 'master',
            title: 'Master',
            icon: Award,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            current: false,
            completed: false,
            requirements: ['100 Jobs Completed', '4.8+ Rating', 'Mentor 3 Rookies']
        }
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            {/* Header */}
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Career Path</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-10 top-20 bottom-20 w-1 bg-border -z-10" />

                <div className="space-y-12">
                    {levels.map((level, i) => (
                        <div key={level.id} className="relative pl-12">
                            {/* Icon Marker */}
                            <div className={cn(
                                "absolute left-0 top-0 h-9 w-9 rounded-full border-4 border-background flex items-center justify-center z-10",
                                level.completed || level.current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                {level.completed ? <Check className="h-4 w-4" /> : <level.icon className="h-4 w-4" />}
                            </div>

                            {/* Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className={cn(
                                    "rounded-2xl p-5 border shadow-sm transition-all",
                                    level.current
                                        ? "bg-card border-primary ring-2 ring-primary/20 shadow-lg"
                                        : level.completed ? "bg-card/50 border-border opacity-70" : "bg-secondary/30 border-dashed border-border opacity-60"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className={cn("p-2 rounded-xl", level.bg)}>
                                            <level.icon className={cn("h-6 w-6", level.color)} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg">{level.title}</h3>
                                            {level.current && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Current Level</span>}
                                        </div>
                                    </div>
                                    {!level.completed && !level.current && <Lock className="h-5 w-5 text-muted-foreground" />}
                                </div>

                                <div className="mt-4 space-y-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Requirements</h4>
                                    {level.requirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 text-sm font-medium">
                                            {level.completed ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <div className={cn("h-4 w-4 rounded-full border-2", level.current && idx === 0 ? "border-green-500 bg-green-500" : "border-muted-foreground")} />
                                            )}
                                            <span className={level.completed ? "line-through opacity-50" : ""}>{req}</span>
                                        </div>
                                    ))}
                                </div>

                                {level.current && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Progress</span>
                                            <span>65%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full w-[65%]" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
