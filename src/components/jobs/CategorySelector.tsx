import { Wrench, Zap, Sparkles, Truck, Shovel, Monitor, Paintbrush, MoreHorizontal, Hammer } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CategorySelectorProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}

const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'cleaning', name: 'Cleaning', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'gardening', name: 'Gardening', icon: Shovel, color: 'text-green-600', bg: 'bg-green-600/10' },
    { id: 'tech', name: 'Tech', icon: Monitor, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'other', name: 'Other', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-500/10' },
];

export function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(cat.id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group",
                            isSelected
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                        )}
                        type="button"
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                            isSelected ? "bg-primary text-primary-foreground" : cn(cat.bg, cat.color)
                        )}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <span className={cn(
                            "font-bold text-sm transition-colors",
                            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>{cat.name}</span>

                        {isSelected && (
                            <motion.div
                                layoutId="active-ring"
                                className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
