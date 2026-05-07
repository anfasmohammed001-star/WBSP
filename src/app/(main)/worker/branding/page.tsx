'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Palette, Image as ImageIcon, Upload, Eye, Check, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BrandingKit() {
    const navigate = useNavigate();
    const [primaryColor, setPrimaryColor] = useState('#2563eb');

    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
                        Branding Kit
                        <Palette className="w-5 h-5 text-pink-500" />
                    </h1>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-white/5 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">

                {/* Logo & Cover */}
                <section>
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                        Profile Visuals
                    </h2>

                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6">
                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Cover Image</label>
                            <div className="w-full h-32 bg-slate-800 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group">
                                <Upload className="w-6 h-6 text-slate-500 group-hover:text-blue-400 mb-2" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-white">Tap to upload</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Profile Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-slate-800 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                    <span className="text-xs font-bold text-slate-600">No Logo</span>
                                </div>
                                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                    Upload New
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Brand Colors */}
                <section>
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-blue-400" />
                        Brand Color
                    </h2>

                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6">
                        <p className="text-xs text-slate-500 mb-4">Choose a primary color for your buttons and highlights.</p>
                        <div className="flex flex-wrap gap-4">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setPrimaryColor(c)}
                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                                    style={{ backgroundColor: c, boxShadow: primaryColor === c ? `0 0 20px ${c}60` : 'none' }}
                                >
                                    {primaryColor === c && <Check className="w-6 h-6 text-white" />}
                                </button>
                            ))}
                            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:bg-white/5">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Save */}
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10 flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
