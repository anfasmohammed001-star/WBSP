import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Phone, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Commenting out potentially crashing components/services for now
// import { useAuth } from '../hooks/useAuth';
// import { jobService } from '../services/jobService';
// import { realtimeService } from '../services/realtimeService';
import LiveTrackingMap from '../components/LiveTrackingMap';
// import { ReviewModal } from '../components/jobs/ReviewModal';

export default function JobTracking() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data State
    const [jobStep, setJobStep] = useState(2); // On the Way
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Mock Tracking Data
    const trackingData = {
        otp_code: '1234',
        started_at: null,
    };

    const steps = [
        { label: 'Accepted', time: '10:00 AM' },
        { label: 'On the Way', time: '10:05 AM' },
        { label: 'Arrived', time: '10:20 AM' },
        { label: 'In Progress', time: 'Now' }
    ];

    const handleCompleteJob = () => {
        setJobStep(5);
        setTimeout(() => setIsReviewOpen(true), 1000);
    };

    return (
        <div className="bg-background min-h-screen flex flex-col transition-colors duration-300 relative text-foreground">
            {/* Live Map Area */}
            <div className="absolute inset-0 z-0">
                <LiveTrackingMap workerLocation={{ lat: 11.0168, lng: 76.9558 }} />
            </div>

            {/* UI Overlay */}
            <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
                {/* Header */}
                <header className="p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
                        {jobStep >= 5 ? (
                            <div className="flex items-center space-x-2 text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Job Completed</span>
                            </div>
                        ) : (
                            <>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    Live Tracking
                                </span>
                            </>
                        )}
                    </div>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1" />

                {/* Bottom Status Card */}
                <div className="p-4 pb-8 pointer-events-auto">
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="bg-card rounded-[2rem] shadow-2xl overflow-hidden border border-border"
                    >
                        {/* Status Stepper */}
                        <div className="px-6 py-6 border-b border-border">
                            <div className="flex items-center justify-between relative">
                                {/* Connecting Line */}
                                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-secondary -z-10" />

                                {steps.map((s, i) => {
                                    const stepNum = i + 1;
                                    const isActive = stepNum <= jobStep;
                                    const isCurrent = stepNum === jobStep;

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 bg-card px-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-primary border-primary text-white' : 'bg-secondary border-secondary text-muted-foreground'}`}>
                                                {isActive ? <ShieldCheck className="h-4 w-4" /> : <span className="text-xs font-bold">{stepNum}</span>}
                                            </div>
                                            <span className={`text-[10px] font-bold whitespace-nowrap ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div
                                    className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className="relative">
                                        <div className="h-16 w-16 bg-zinc-100 rounded-full overflow-hidden border-2 border-primary p-0.5">
                                            <img src="https://ui-avatars.com/api/?name=Mario+S" alt="Worker" className="h-full w-full object-cover rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">Mario S.</h3>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <span>Plumber</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-yellow-500 font-bold">★ 4.9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button className="h-12 w-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {jobStep < 5 ? (
                                <div className="mt-6 p-4 bg-secondary/50 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">OTP Code</p>
                                        <p className="text-2xl font-mono font-black text-foreground tracking-widest">{trackingData?.otp_code || '----'}</p>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={handleCompleteJob}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                        >
                                            Mark Complete (Demo)
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 p-4 bg-green-500/10 rounded-xl text-center">
                                    <p className="text-green-600 font-bold">Job Completed Successfully</p>
                                    <button className="text-xs text-muted-foreground underline mt-1">Write a Review</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ReviewModal Placeholder */}
            {isReviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-white p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4 text-black">Review Modal Placeholder</h2>
                        <button onClick={() => setIsReviewOpen(false)} className="text-blue-500">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
