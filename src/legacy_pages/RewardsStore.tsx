import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Zap, Shield, BookOpen, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RewardsStore() {
    const navigate = useNavigate();

    const items = [
        { id: 1, name: 'Profile Boost (24h)', cost: 100, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: 2, name: 'Background Check Fee Waiver', cost: 500, icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 3, name: 'Premium Analytics Access', cost: 300, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 4, name: '$10 Gas Card', cost: 1000, icon: Gift, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-black">Rewards Store</h1>
                </div>
                <div className="bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-black text-yellow-600 flex items-center">
                    450 Credits
                </div>
            </header>

            <div className="p-4 grid grid-cols-2 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-card border border-border p-4 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className={cn("h-16 w-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", item.bg)}>
                            <item.icon className={cn("h-8 w-8", item.color)} />
                        </div>
                        <h3 className="font-bold text-sm mb-1 leading-tight min-h-[40px] flex items-center">{item.name}</h3>
                        <div className="mt-auto pt-3">
                            <button className="bg-secondary px-4 py-2 rounded-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-colors">
                                {item.cost} Credits
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
