'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import {
    ChevronLeft, Settings, MessageSquare, Phone, Info,
    Locate as CurrentLocation, Map as MapIcon, Minus, Plus, CheckCircle, Navigation, ShieldCheck,
    Activity, Zap, Shield, Radar, Target, User, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// Dynamic Map Import
const LiveTrackingMap = lazy(() => import('@/components/LiveTrackingMap'));

interface TrackingData {
    otp_code: string;
    started_at: string | null;
    current_location: any;
}

export default function JobTracking() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // -- State --
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
    const [job, setJob] = useState<any>(null);
    const [workerLocation, setWorkerLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [customerLocation, setCustomerLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [eta, setEta] = useState<string>("8 MIN");
    const [distance, setDistance] = useState<string>("3.4 KM");

    // -- Effects --
    useEffect(() => {
        // Mock data if no real data found
        const mockJob = {
            title: "Emergency Pipe Burst",
            worker: {
                full_name: "Alexander Sterling",
                profession: "Master Plumber",
                rating: 4.9,
                phone: "+1234567890"
            }
        };
        const mockTracking = {
            otp_code: "8821",
            started_at: null,
            current_location: null
        };

        setJob(mockJob);
        setTrackingData(mockTracking);
        setCustomerLocation({ lat: 11.0180, lng: 76.9560 });
        setWorkerLocation({ lat: 11.0168, lng: 76.9558 });

        // Simulator for movement
        const interval = setInterval(() => {
            setWorkerLocation((prev) => {
                if (!prev) return { lat: 11.0168, lng: 76.9558 };
                return {
                    lat: prev.lat + (Math.random() - 0.5) * 0.0002,
                    lng: prev.lng + (Math.random() - 0.5) * 0.0002
                };
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);

    return (
        <div className="bg-[#020408] min-h-screen relative font-sans overflow-hidden text-white">

            {/* 1. Full Screen Map Layer / Radar Layer */}
            <div className="absolute inset-0 z-0 opacity-40 grayscale group hover:grayscale-0 transition-all duration-1000">
                <Suspense fallback={
                    <div className="h-full w-full bg-[#020408] flex flex-col items-center justify-center gap-6">
                        <Radar className="w-16 h-16 text-primary animate-spin-slow" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Syncing Vector Stream...</span>
                    </div>
                }>
                    <LiveTrackingMap
                        workerLocation={workerLocation}
                        customerLocation={customerLocation}
                    />
                </Suspense>

                {/* HUD Overlay - Digital Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Visual Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-[#020408]/80 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020408_100%)] opacity-60 pointer-events-none" />
            </div>

            {/* 2. Top UI Layer - Tactical HUD */}
            <div className="absolute top-0 left-0 w-full z-40 px-6 pt-10 pb-4 pointer-events-none">
                <div className="flex justify-between items-center mb-6 pointer-events-auto">
                    <motion.button
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="h-14 w-14 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </motion.button>

                    <div className="glass-obsidian border border-primary/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="relative">
                            <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
                            <div className="w-3 h-3 bg-primary rounded-full relative" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Vector Signal: Strong</span>
                    </div>

                    <button className="h-14 w-14 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center text-white/70 hover:text-white pointer-events-auto">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Tactical Status Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-obsidian border border-white/5 rounded-[2.5rem] p-8 shadow-2xl mx-auto max-w-xl pointer-events-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Activity className="w-32 h-32 text-primary" />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 italic">Mission Status</span>
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Deployment En Route</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Estimated Arrival</span>
                            <div className="text-3xl font-black text-primary tracking-tighter">{eta}</div>
                        </div>
                    </div>

                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                        />
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-black text-white/40 uppercase tracking-[0.2em] px-1">
                        <span className="text-primary italic">In Transit</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Vector Arrival</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Sync Initiation</span>
                    </div>
                </motion.div>
            </div>

            {/* 3. Map Control Clusters */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
                {[
                    { icon: Navigation, label: 'Compass' },
                    { icon: Target, label: 'Centering' },
                    { icon: MapIcon, label: 'Satellite' }
                ].map((btn, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center text-white/40 hover:text-primary transition-all group relative"
                    >
                        <btn.icon className="w-6 h-6" />
                        <span className="absolute right-full mr-4 px-3 py-1 bg-primary text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {btn.label}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* 4. Bottom Perspective - Vector Identity Card */}
            <div className="absolute bottom-10 left-6 right-6 z-50 max-w-2xl mx-auto">
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 100 }}
                    className="glass-obsidian rounded-[3rem] p-8 shadow-2xl shadow-primary/10 border border-white/5 border-t-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <div className="flex items-center gap-6 mb-8 relative">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 border-primary/30 p-1.5 bg-black profile-glow transition-all duration-500">
                                <img
                                    src={job?.worker?.profile_image_url || `https://i.pravatar.cc/150?u=operative`}
                                    className="w-full h-full rounded-[2.2rem] object-cover opacity-90 group-hover:opacity-100"
                                    alt="Worker"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl border-4 border-[#020408] shadow-2xl shadow-primary/40">
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-1 uppercase">
                                {job?.worker?.full_name || 'Identifying...'}
                            </h2>
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{job?.worker?.profession || 'Specialist'}</p>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <div className="flex items-center gap-1.5 text-primary">
                                    <Star className="w-3.5 h-3.5 fill-primary" />
                                    <span className="text-xs font-black">4.9 RANK</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block mb-1 px-1">Tactical Distance</span>
                            <div className="text-2xl font-black text-white tracking-tighter px-1">{distance}</div>
                        </div>
                    </div>

                    {/* Verification Protocol Area */}
                    <div className="mb-8 bg-white/5 rounded-[2rem] p-6 border border-white/5 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-20 h-20 text-primary" />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Zap className="w-3 h-3 text-primary animate-pulse" />
                                Deployment Sync Pin
                            </span>
                            <span className="text-[9px] font-black text-primary uppercase border border-primary/30 px-3 py-1 rounded-lg">Secured Protocol</span>
                        </div>

                        <div className="flex justify-center gap-4">
                            {(trackingData?.otp_code || "8821").split('').map((digit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-16 h-20 bg-black/40 border-2 border-white/10 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-inner group-hover:border-primary/50 transition-colors"
                                >
                                    {digit}
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-center text-[9px] text-white/20 font-black mt-5 uppercase tracking-[0.2em] italic">
                            Awaiting Vector Sync... Relay this pin to initiated operative.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/chat/hub')}
                            className="flex items-center justify-center gap-3 h-20 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-2xl group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            Encrypted Chat
                        </button>
                        <button
                            onClick={() => window.location.href = `tel:${job?.worker?.phone || '123'}`}
                            className="flex items-center justify-center gap-3 h-20 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-2xl group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Phone className="w-5 h-5" />
                            </div>
                            Voice Uplink
                        </button>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .profile-glow {
                    box-shadow: 0 0 40px rgba(37, 99, 235, 0.1);
                }
                .profile-glow:hover {
                    box-shadow: 0 0 60px rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </div >
    );
}
