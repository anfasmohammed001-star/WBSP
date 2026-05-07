import { MapPin, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface JobCardProps {
    id: string;
    title: string;
    category: string;
    distance: string;
    budget: number;
    urgency: string;
    postedTime: string;
    description: string;
    image?: string;
    duration?: string;
    startTime?: string;
    onAccept?: () => void;
}

export function JobCard({
    title,
    category,
    distance,
    budget,
    urgency,
    postedTime,
    description,
    image,
    duration = "Approx. 4 hours",
    startTime = "Today",
    onAccept
}: JobCardProps) {
    const isCritical = urgency === 'Critical' || urgency === 'HIGH URGENCY';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
        >
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={image || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                    <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-lg",
                        isCritical ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                    )}>
                        {urgency}
                    </span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-blue-500 tracking-[0.1em] uppercase">{category}</div>
                        <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">{title}</h4>
                    </div>
                    <div className="text-3xl font-black text-green-600 dark:text-green-400 font-mono tracking-tighter">
                        ${budget}
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="grid grid-cols-2 gap-y-4 pt-2">
                    <div className="flex items-center text-xs font-bold text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {distance} away
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
                        {postedTime}
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {duration}
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
                        {startTime}
                    </div>
                </div>

                <div className="flex space-x-3 pt-2">
                    <Button
                        variant="premium"
                        className="flex-1 rounded-2xl h-16 text-sm font-black tracking-widest uppercase group/btn"
                        onClick={onAccept}
                    >
                        Accept Job
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                    <button className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Bookmark className="h-6 w-6 text-gray-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
