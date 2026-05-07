'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 2;
            });
        }, 20);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-[#020817] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-75" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo/Icon Area */}
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-md"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-4xl font-bold text-white tracking-widest">W</span>
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">WBSP</h1>
                <p className="text-slate-400 text-sm tracking-widest uppercase mb-12">Worker Booking Service Platform</p>

                {/* Progress Bar */}
                <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    );
}
