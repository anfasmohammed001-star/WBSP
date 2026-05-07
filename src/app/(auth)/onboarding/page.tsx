import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Check, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'customer' | 'worker'>('customer');

    const handleContinue = () => {
        if (selectedRole === 'customer') {
            navigate('/auth/register/customer'); // Assuming route
        } else {
            navigate('/auth/register/worker');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col p-6">
            {/* Header Navigation */}
            <header className="flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-sm border border-border">
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <span className="font-bold text-lg tracking-tight">WBSP</span>
                <div className="w-10"></div> {/* Spacer for balance */}
            </header>

            <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-4">Choose your journey</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Select how you would like to experience the WBSP ecosystem.
                    </p>
                </motion.div>

                {/* Selection Cards */}
                <div className="space-y-6 flex-1">
                    {/* Customer Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole('customer')}
                        className={cn(
                            "relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300",
                            selectedRole === 'customer'
                                ? "border-primary bg-blue-50/10 shadow-lg shadow-blue-500/5 ring-4 ring-blue-500/10"
                                : "border-border bg-card hover:border-blue-200"
                        )}
                    >
                        {selectedRole === 'customer' && (
                            <div className="absolute top-6 right-6 p-1 rounded-full bg-primary text-primary-foreground">
                                <Check className="w-4 h-4" />
                            </div>
                        )}

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-blue-100/50 flex items-center justify-center mb-6 text-primary">
                                <User className="w-10 h-10" />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">For Clients</span>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Join as a Customer</h3>
                            <p className="text-muted-foreground">
                                Access top-tier services and manage your projects effortlessly with expert talent.
                            </p>
                        </div>
                    </motion.div>

                    {/* Worker Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole('worker')}
                        className={cn(
                            "relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300",
                            selectedRole === 'worker'
                                ? "border-primary bg-blue-50/10 shadow-lg shadow-blue-500/5 ring-4 ring-blue-500/10"
                                : "border-border bg-card hover:border-blue-200"
                        )}
                    >
                        {selectedRole === 'worker' && (
                            <div className="absolute top-6 right-6 p-1 rounded-full bg-primary text-primary-foreground">
                                <Check className="w-4 h-4" />
                            </div>
                        )}

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 text-slate-700">
                                <Briefcase className="w-9 h-9" />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">For Professionals</span>
                            <h3 className="text-2xl font-bold text-foreground mb-3">Join as a Worker</h3>
                            <p className="text-muted-foreground">
                                Monetize your professional skills and find high-quality opportunities worldwide.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pb-8">
                    <button
                        onClick={handleContinue}
                        className="w-full py-4 text-center bg-primary text-primary-foreground font-bold rounded-2xl text-lg shadow-premium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-center mt-6 text-muted-foreground font-medium">
                        Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Log in</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
