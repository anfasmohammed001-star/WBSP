import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, TrendingUp, History, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function CreditSystem() {
    const navigate = useNavigate();

    const history = [
        { id: 1, action: 'Completed "Safety First" Course', amount: '+50', date: 'Today', type: 'earn' },
        { id: 2, action: 'Redeemed: Profile Boost', amount: '-100', date: 'Yesterday', type: 'spend' },
        { id: 3, action: 'Weekly Streak Bonus', amount: '+25', date: 'Jan 12', type: 'earn' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <h1 className="text-lg font-black">Pro Credits</h1>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-4 space-y-6">

                {/* Balance Card */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="font-bold text-yellow-100 uppercase text-xs tracking-widest mb-1">Current Balance</p>
                        <div className="text-5xl font-black mb-2">450</div>
                        <p className="text-sm font-medium opacity-90">Credits available to spend</p>
                    </div>
                    <Coins className="absolute -bottom-6 -right-6 h-32 w-32 text-white/20 rotate-12" />
                </div>

                {/* Ways to Earn */}
                <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                        Earn More
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card border border-border p-4 rounded-2xl text-center hover:border-primary/50 cursor-pointer transition-colors">
                            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                            <div className="font-black text-lg">+100</div>
                            <div className="text-xs text-muted-foreground font-bold">Complete Certification</div>
                        </div>
                        <div className="bg-card border border-border p-4 rounded-2xl text-center hover:border-primary/50 cursor-pointer transition-colors">
                            <History className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <div className="font-black text-lg">+10</div>
                            <div className="text-xs text-muted-foreground font-bold">Daily Check-in</div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 className="font-bold text-lg mb-3">History</h3>
                    <div className="space-y-3">
                        {history.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-sm">{item.action}</h4>
                                    <p className="text-[10px] text-muted-foreground">{item.date}</p>
                                </div>
                                <div className={cn("font-black text-sm", item.type === 'earn' ? "text-green-600" : "text-red-500")}>
                                    {item.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black shadow-lg" onClick={() => navigate('/worker/rewards')}>
                    Go to Rewards Store
                </button>
            </div>
        </div>
    );
}
