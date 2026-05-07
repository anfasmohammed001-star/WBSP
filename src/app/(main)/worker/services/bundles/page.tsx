'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Plus, DollarSign, Tag, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function ServiceBundles() {
    const navigate = useNavigate();

    const bundles = [
        {
            id: 1,
            title: "Summer Maintenance Pack",
            items: ["AC Tune-up", "Filter Replacement", "Duct Inspection"],
            price: 249,
            original: 320,
            sold: 14
        },
        {
            id: 2,
            title: "Plumbing Emergency Kit",
            items: ["Priority Response", "Leak Check", "Valve Tagging"],
            price: 199,
            original: 250,
            sold: 8
        }
    ];

    return (
        <div className="min-h-screen bg-[#020817] text-white pb-24 font-sans">
            {/* Header */}
            <div className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-400"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        Bundles
                        <Package className="w-5 h-5 text-indigo-500" />
                    </h1>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

                {/* Intro */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-[#020817] border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-lg font-black text-white mb-2">Boost Your Sales</h2>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Customers are <span className="text-white font-bold">3x more likely</span> to book when services are bundled. Save them money, earn more work.
                        </p>
                        <Button size="sm" className="bg-white text-indigo-900 font-bold hover:bg-indigo-50">
                            Create First Bundle
                        </Button>
                    </div>
                </div>

                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Your Active Bundles</h2>

                {bundles.map(bundle => (
                    <div key={bundle.id} className="bg-[#0f172a] border border-white/5 rounded-3xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-white text-lg mb-1">{bundle.title}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold">
                                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        Save ${(bundle.original - bundle.price)}
                                    </span>
                                    <span className="text-slate-500">{bundle.sold} Sold</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-black text-white">${bundle.price}</span>
                                <span className="text-xs text-slate-500 line-through decoration-red-500 decoration-2">${bundle.original}</span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            {bundle.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-slate-600 font-medium">Auto-renew disabled</span>
                            <button className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-white transition-colors">
                                Manage
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
