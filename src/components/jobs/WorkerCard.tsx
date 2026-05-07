import { Star, MapPin, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface WorkerCardProps {
    name: string;
    rating: number;
    jobsCompleted: number;
    skills: string[];
    distance: string;
    hourlyRate: number;
    matchScore?: number;
    avatarUrl?: string;
    isVerified?: boolean;
}

export function WorkerCard({
    name,
    rating,
    jobsCompleted,
    skills,
    distance,
    hourlyRate,
    matchScore,
    avatarUrl,
    isVerified = true
}: WorkerCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm space-y-6 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="h-16 w-16 bg-secondary rounded-2xl overflow-hidden border border-border">
                            <img src={avatarUrl || `https://i.pravatar.cc/150?u=${name}`} alt={name} className="h-full w-full object-cover" />
                        </div >
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 shadow-sm">
                                <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-600/10" />
                            </div>
                        )}
                    </div >
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-foreground">{name}</h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                            <div className="flex items-center text-yellow-500">
                                <Star className="h-3 w-3 fill-current mr-1" />
                                <span className="text-[11px] font-black">{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-muted-foreground font-bold text-[10px]">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{jobsCompleted} successful jobs</span>
                        </div>
                    </div>
                </div >
                {matchScore && (
                    <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20">
                        <span className="text-[10px] font-black tracking-widest uppercase">{matchScore}% Match</span>
                    </div>
                )}
            </div >

            <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-lg border border-border uppercase tracking-tighter">
                        {skill}
                    </span>
                ))}
                {skills.length > 3 && (
                    <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-lg border border-border">
                        +{skills.length - 3}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground font-bold text-[11px] tracking-tight">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    {distance} from you
                </div>
                <div className="flex items-baseline">
                    <span className="text-2xl font-black text-foreground tracking-tighter">${hourlyRate}</span>
                    <span className="text-[11px] font-bold text-muted-foreground ml-1">/ hr</span>
                </div>
            </div>

            <div className="flex space-x-3 pt-2">
                <Button variant="premium" className="flex-1 rounded-2xl h-14 text-sm font-black tracking-widest uppercase">
                    Hire Me
                </Button>
                <button className="h-14 w-14 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
                </button>
            </div>
        </motion.div >
    );
}
