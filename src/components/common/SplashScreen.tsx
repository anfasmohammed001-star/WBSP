'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-[#020408] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Ambient Background for Splash */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0.15 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-primary rounded-full blur-[120px]"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary via-purple-600 to-indigo-600 p-[3px] shadow-[0_0_50px_rgba(37,99,235,0.3)]"
                        >
                            <div className="w-full h-full rounded-[2.3rem] bg-[#020408] flex items-center justify-center">
                                <span className="text-5xl font-black tracking-tighter text-white italic">W</span>
                            </div>
                        </motion.div>

                        <div className="flex flex-col items-center gap-2">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl font-black tracking-tighter text-white"
                            >
                                WBSP <span className="text-primary italic">OS</span>
                            </motion.h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 120 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="h-1 bg-white/10 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-primary"
                                    animate={{ x: [-120, 120] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20"
                    >
                        Initializing Professional Matrix
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
