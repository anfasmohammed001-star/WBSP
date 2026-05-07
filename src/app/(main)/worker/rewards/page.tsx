'use client';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Gift, Tag, ArrowRight } from 'lucide-react';

export default function Rewards() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="h-64 bg-gradient-to-br from-violet-600 to-indigo-700 relative text-white p-6">
                <button onClick={() => navigate(-1)} className="absolute top-6 left-4 p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-col items-center justify-center h-full mt-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 shadow-xl">
                        <Gift className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black">2,450</h1>
                    <p className="text-sm font-medium opacity-80 uppercase tracking-widest mt-1">Available Points</p>
                </div>
            </div>

            <div className="p-6 -mt-8 relative z-10 bg-background rounded-t-3xl min-h-[500px]">
                <h2 className="font-bold text-lg mb-4">Redeem Rewards</h2>
                <div className="space-y-4">
                    {[
                        { title: '$10 Off Next Job', cost: 1000, color: 'bg-green-500' },
                        { title: 'Free Priority Booking', cost: 500, color: 'bg-blue-500' },
                        { title: '25% Off Plumbing', cost: 1500, color: 'bg-orange-500' },
                    ].map((item, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm group">
                            <div className="flex items-center space-x-4">
                                <div className={`h-12 w-12 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center`}>
                                    <Tag className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground font-bold text-primary">{item.cost} pts</p>
                                </div>
                            </div>
                            <button className="bg-secondary hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-xl text-xs font-bold flex items-center">
                                Redeem <ArrowRight className="ml-1 h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <h2 className="font-bold text-lg mb-4 mt-8">How to earn</h2>
                <div className="bg-secondary/30 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span>Complete a job</span>
                        <span className="font-bold text-green-500">+100 pts</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Leave a review</span>
                        <span className="font-bold text-green-500">+50 pts</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Refer a friend</span>
                        <span className="font-bold text-green-500">+500 pts</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
