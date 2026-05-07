'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, UserSearch, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
    const { register } = useAuth();
    const [userType, setUserType] = useState<UserType>('customer');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [workTypes, setWorkTypes] = useState<string[]>([]);

    const WORK_TYPES = [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Painting",
        "Carpentry",
        "Gardening",
        "Tech"
    ];

    // Reset work types when role changes
    useEffect(() => {
        if (userType !== 'worker') {
            setWorkTypes([]);
        }
    }, [userType]);

    const handleWorkTypeToggle = (type: string) => {
        if (workTypes.includes(type)) {
            setWorkTypes(workTypes.filter(t => t !== type));
        } else {
            setWorkTypes([...workTypes, type]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (userType === 'worker' && workTypes.length === 0) {
            toast.error("Please select at least one type of work.");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Starting registration process for:", formData.email, "as", userType);

            // 1. Perform registration via useAuth (which now handles auto-login)
            await register(
                formData.email,
                formData.password,
                userType,
                formData.fullName,
                workTypes // Pass selected work types
            );

            console.log("Registration successful. Redirecting...");
            toast.success("Account created! Redirecting...");

            // Redirect based on role immediately
            if (userType === 'worker') {
                navigate('/worker/dashboard');
            } else if (userType === 'supervisor') {
                navigate('/supervisor/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (error: any) {
            console.error("Registration failed:", error);
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/login')}
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <div className="font-bold text-lg tracking-widest text-foreground">WBSP</div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 pb-12 max-w-lg mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground text-sm">
                            Join the WBSP ecosystem as a customer or professional.
                        </p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="flex bg-secondary p-1 rounded-2xl relative">
                        <motion.div
                            className="absolute inset-y-1 w-[calc(33.33%-4px)] bg-background rounded-xl shadow-sm z-0"
                            animate={{ x: userType === 'customer' ? 0 : userType === 'worker' ? '100%' : '200%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            type="button"
                            onClick={() => setUserType('customer')}
                            className={cn(
                                "flex-1 py-3 text-[10px] sm:text-xs font-bold z-10 transition-colors uppercase tracking-widest",
                                userType === 'customer' ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('worker')}
                            className={cn(
                                "flex-1 py-3 text-[10px] sm:text-xs font-bold z-10 transition-colors uppercase tracking-widest",
                                userType === 'worker' ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Worker
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('supervisor')}
                            className={cn(
                                "flex-1 py-3 text-[10px] sm:text-xs font-bold z-10 transition-colors uppercase tracking-widest",
                                userType === 'supervisor' ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Supervisor
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <Input
                                placeholder="Full Name"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="bg-secondary text-foreground border-border placeholder:text-muted-foreground"
                            />

                            {/* Type of Works Selection for Workers */}
                            <AnimatePresence>
                                {userType === 'worker' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-sm font-medium text-muted-foreground ml-1">
                                            Type of Works <span className="text-xs opacity-70">(Select multiple)</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {WORK_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleWorkTypeToggle(type)}
                                                    className={cn(
                                                        "p-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between",
                                                        workTypes.includes(type)
                                                            ? "bg-primary/10 text-primary border border-primary/30"
                                                            : "bg-secondary text-muted-foreground border border-transparent hover:bg-secondary/80"
                                                    )}
                                                >
                                                    {type}
                                                    {workTypes.includes(type) && (
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Input
                                type="email"
                                placeholder="Email address"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-secondary text-foreground border-border placeholder:text-muted-foreground"
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-secondary text-foreground border-border placeholder:text-muted-foreground"
                            />
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="bg-secondary text-foreground border-border placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="flex items-center space-x-2 px-1">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-5 w-5 text-primary focus:ring-primary border-border bg-secondary rounded-lg cursor-pointer transition-colors"
                            />
                            <label htmlFor="terms" className="text-xs text-muted-foreground">
                                I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            size="lg"
                            className="w-full text-lg font-bold h-14 rounded-2xl shadow-lg shadow-primary/20"
                            isLoading={isLoading}
                        >
                            Complete Sign Up
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground tracking-tight">Already have an account? </span>
                            <Link to="/login" className="font-bold text-primary hover:text-primary/90">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Bottom Indicator */}
            <div className="flex justify-center pb-4">
                <div className="h-1.5 w-32 bg-secondary rounded-full" />
            </div>
        </div>
    );
}
