'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Maximize, Save, Ruler, Undo, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function ARMeasure() {
    const navigate = useNavigate();
    const [points, setPoints] = useState<{ x: number, y: number }[]>([]);

    const addPoint = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (points.length < 2) {
            setPoints([...points, { x, y }]);
        }
    };

    const reset = () => setPoints([]);

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative font-sans">
            {/* Camera Feed Placeholder */}
            <div
                className="absolute inset-0 z-0 bg-slate-900 cursor-crosshair"
                onClick={addPoint}
            >
                {/* Simulated Room */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-70"></div>

                {/* AR Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* Points & Lines */}
                {points.map((p, i) => (
                    <div key={i} className="absolute w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_10px_#3b82f6] -ml-2 -mt-2" style={{ top: p.y, left: p.x }} />
                ))}

                {points.length === 2 && (
                    <svg className="absolute inset-0 pointer-events-none">
                        <line
                            x1={points[0].x} y1={points[0].y}
                            x2={points[1].x} y2={points[1].y}
                            stroke="white" strokeWidth="2" strokeDasharray="5,5"
                            className="drop-shadow-md"
                        />
                        <text x={(points[0].x + points[1].x) / 2} y={(points[0].y + points[1].y) / 2 - 10} fill="white" className="text-xl font-bold bg-black/50 px-2 rounded">
                            2.4m
                        </text>
                    </svg>
                )}
            </div>

            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">AR Live</span>
                </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                        <Ruler className="w-6 h-6 text-blue-400" />
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Distance</span>
                            <h2 className="text-2xl font-black text-white">{points.length === 2 ? '2.4 m' : '--'}</h2>
                        </div>
                    </div>
                    {points.length > 0 && (
                        <button
                            onClick={reset}
                            className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Undo className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10">
                        <Camera className="w-5 h-5" />
                        Capture & Save
                    </button>
                </div>

                <p className="text-center text-xs text-white/50 mt-4 font-medium flex items-center justify-center gap-1">
                    <MousePointer2 className="w-3 h-3" />
                    {points.length === 0 ? "Tap start point" : points.length === 1 ? "Tap end point" : "Measurement complete"}
                </p>
            </div>
        </div>
    );
}
