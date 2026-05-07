'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Share2, Copy, Check, Star, TrendingUp, Users, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CustomerRewards() {
    const [copied, setCopied] = React.useState(false);
    const referralCode = "WBSP-MATRIX-777";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        toast.success("Referral code copied to matrix!");
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = [
        { label: 'Total Earned', value: '$1,240', icon: Gift, color: 'text-emerald-500' },
        { label: 'Friends Joined', value: '14', icon: Users, color: 'text-primary' },
        { label: 'Points Rank', value: 'Elite', icon: Crown, color: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen pb-32 pt-10 px-6 bg-[#020408] text-white">
            <div className="bg-blur-blobs">
                <div className="blob bg-purple-600/10 -top-[10%] -left-[10%] scale-150" />
                <div className="blob bg-primary/10 bottom-[10%] -right-[10%] scale-150" />
            </div>

            <div className="relative z-10 max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Rewards & Referral Matrix</h1>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Scale your network, earn premium yields.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="bg-white/5 border-white/10 p-4 flex flex-col items-center text-center">
                            <stat.icon className={cn("w-6 h-6 mb-3", stat.color)} />
                            <div className="text-xl font-black mb-1">{stat.value}</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-white/30">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Referral Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <Card className="glass-obsidian border-primary/30 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Share2 className="w-32 h-32 text-primary" />
                        </div>
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-black mb-2">Invite New Vectors</h3>
                            <p className="text-white/40 text-xs font-medium mb-8">Share your code with friends and earn $50 for every successful deployment they initiate.</p>

                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                                <div className="flex-1 font-black text-xl tracking-widest text-primary">{referralCode}</div>
                                <Button onClick={copyToClipboard} variant="ghost" className="p-2 hover:bg-white/5">
                                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Reward Tiers */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h2 className="text-xl font-black tracking-tight">Active Missions</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">View All</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'First Deployment', reward: '500 Points', progress: 100, status: 'Claimed' },
                            { title: 'Refer 5 Friends', reward: '$250 Credit', progress: 60, status: 'In Progress' },
                            { title: 'Elite Status Reach', reward: 'Zero Fees', progress: 20, status: 'Locked' },
                        ].map((mission, idx) => (
                            <Card key={idx} className="bg-white/5 border-white/5 p-6 flex items-center justify-between group">
                                <div className="flex-1">
                                    <h4 className="font-black text-lg mb-1 group-hover:text-primary transition-colors">{mission.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${mission.progress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-white/20 uppercase w-12 text-right">{mission.progress}%</span>
                                    </div>
                                </div>
                                <div className="ml-8 text-right">
                                    <div className="text-sm font-black text-primary">{mission.reward}</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-white/30">{mission.status}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

// Helper function
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
