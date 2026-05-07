import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface BadgeProps {
    label: string;
    icon: LucideIcon;
    color: string; // Tailwind class, e.g. "bg-yellow-500"
    description?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Badge({ label, icon: Icon, color, description, size = 'md' }: BadgeProps) {
    const sizeClasses = {
        sm: 'p-1.5 text-[10px]',
        md: 'p-2 text-xs',
        lg: 'p-3 text-sm',
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="flex flex-col items-center group cursor-default"
        >
            <div className={cn(
                "rounded-full flex items-center justify-center shadow-md border-2 border-background ring-2 ring-offset-2 ring-offset-background",
                color,
                size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-14 h-14',
                `ring-${color.split('-')[1]}-200` // Approximation for ring color
            )}>
                <Icon className={cn("text-white", iconSizes[size])} />
            </div>
            <span className="mt-1 font-bold text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {label}
            </span>
            {description && (
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded-lg -top-8 w-max max-w-[120px] pointer-events-none z-10">
                    {description}
                </div>
            )}
        </motion.div>
    );
}
