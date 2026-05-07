

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldAlert, Phone, MapPin, AlertTriangle, Siren } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

import { safetyService } from '@/services/safetyService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function SafetyHub() {
    const navigate = useNavigate();
    const auth = useAuth();
    const user = auth?.user;
    const [sosActive, setSosActive] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [incidents, setIncidents] = useState<any[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (sosActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (sosActive && countdown === 0) {
            triggerSOS();
        }
        return () => clearTimeout(timer);
    }, [sosActive, countdown]);

    const triggerSOS = async () => {
        if (!user) return;

        try {
            // Get current location if possible
            navigator.geolocation.getCurrentPosition(async (pos) => {
                await safetyService.reportIncident({
                    reporter_id: user.id,
                    incident_type: 'SOS',
                    location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
                    description: 'Emergency SOS triggered by user'
                });
                toast.error("EMERGENCY SIGNAL SENT TO WBSP DISPATCH");
            }, async () => {
                await safetyService.reportIncident({
                    reporter_id: user.id,
                    incident_type: 'SOS',
                    description: 'Emergency SOS triggered (Location Unavailable)'
                });
                toast.error("EMERGENCY SIGNAL SENT (No GPS)");
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSosActive(false);
            setCountdown(5);
        }
    };

    return (
        <div className={cn(
            "min-h-screen transition-colors duration-500 flex flex-col font-sans relative overflow-hidden",
            sosActive ? "bg-red-900" : "bg-[#020817]"
        )}>
            {/* Background Pulse */}
            {sosActive && (
                <div className="absolute inset-0 z-0 bg-red-600 animate-pulse opacity-50"></div>
            )}

            {/* Header */}
            <div className="relative z-10 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Active</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">

                {sosActive ? (
                    <div className="mb-10">
                        <h1 className="text-6xl font-black text-white mb-2">{countdown}</h1>
                        <p className="text-white font-bold text-lg uppercase tracking-widest animate-pulse">Sending Distress Signal...</p>
                        <Button
                            onClick={() => { setSosActive(false); setCountdown(5); }}
                            className="mt-8 bg-white text-red-600 w-full h-16 rounded-2xl font-black text-xl hover:bg-slate-200"
                        >
                            CANCEL SOS
                        </Button>
                    </div>
                ) : (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSosActive(true)}
                            className="w-64 h-64 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_60px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center border-8 border-red-900/50 relative overflow-hidden group mb-12"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <Siren className="w-20 h-20 text-white mb-2 relative z-10" />
                            <span className="text-3xl font-black text-white tracking-widest relative z-10">SOS</span>
                            <span className="text-[10px] text-red-200 font-bold uppercase mt-1 relative z-10">Tap for Emergency</span>
                        </motion.button>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            <button className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                                <span className="text-xs font-bold text-white uppercase tracking-tighter">Safety Checklist</span>
                            </button>
                            <button className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                                <Phone className="w-8 h-8 text-blue-500" />
                                <span className="text-xs font-bold text-white uppercase tracking-tighter">Hotline</span>
                            </button>
                        </div>

                        {/* Safety Tips Horizontal Scroll */}
                        <div className="w-full mt-8 flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                            {[
                                { title: 'Arrival', tip: 'Share location with a trusted contact.' },
                                { title: 'Handshake', tip: 'Always verify the customer OTP.' },
                                { title: 'Working', tip: 'Keep your phone charged and accessible.' }
                            ].map((tip, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[200px] text-left">
                                    <h4 className="text-emerald-400 font-black text-[10px] uppercase mb-1">{tip.title}</h4>
                                    <p className="text-white text-xs font-medium">{tip.tip}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Location Badge */}
            <div className="relative z-10 p-6 space-y-4">
                <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 animate-pulse">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Current Location</span>
                        <h3 className="text-white font-bold text-sm">Real-time GPS Tracking Active</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
