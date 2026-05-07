'use client';

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import type { User } from '@/types';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, isAuthenticated, user: authUser } = useAuth();
    // Unified redirection helper based on user role
    const redirectUser = (user: User) => {
        const role = user.userType;
        const redirectPath = searchParams.get('redirect');
        console.log("Redirecting user of type:", role, "to", redirectPath || "default dashboard");

        if (redirectPath) {
            navigate(redirectPath);
            return;
        }

        switch (role) {
            case 'worker':
                navigate('/worker/dashboard');
                break;
            case 'supervisor':
                navigate('/supervisor/dashboard');
                break;
            default:
                navigate('/customer/dashboard');
        }
    };

    // Auto-redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated && authUser) {
            redirectUser(authUser as User); // Cast authUser to User type
        }
    }, [isAuthenticated, authUser, navigate]); // Added navigate to dependency array

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading("Connecting to server...");

        try {
            console.log("Starting login process for:", email);
            const data = await login(email, password);

            // Note: useAuth.login already updates the context state 'authUser'
            // We use the result here mainly to trigger the final success toast 
            // and immediate navigation if not already handled by useEffect
            if (data?.user) {
                toast.success("Welcome back!", { id: loadingToast });
                // Use enriched profile for accurate redirection
                redirectUser({
                    id: data.user.id,
                    email: data.user.email!,
                    userType: (data.enrichedProfile?.user_type || data.user.user_metadata?.user_type || 'customer') as any,
                } as any);
            }
        } catch (error: any) {
            console.error("Login process failed:", error);
            toast.error(error.message || "Login failed. Please check your credentials.", { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Decorations */}
            <div className="bg-blur-blobs">
                <div className="blob bg-primary/20 -top-[10%] -left-[10%]" />
                <div className="blob bg-purple-500/10 top-[20%] -right-[10%]" style={{ animationDelay: '-5s' }} />
                <div className="blob bg-blue-400/15 -bottom-[10%] left-[20%]" style={{ animationDelay: '-10s' }} />
            </div>

            {/* Header */}
            <div className="p-6 flex items-center justify-between relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-center hover:bg-secondary transition-all active:scale-90"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    WBSP
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 pb-20 max-w-md mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-10"
                >
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black tracking-tight text-balance leading-[1.1]">
                            Welcome to the <br />
                            <span className="text-primary italic">Future</span> of Work
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Log in to access your professional dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 bg-card/50 border-border/50 h-14 rounded-2xl focus:bg-card focus:shadow-xl focus:shadow-primary/5 transition-all text-base"
                                />
                            </div>
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 bg-card/50 border-border/50 h-14 rounded-2xl focus:bg-card focus:shadow-xl focus:shadow-primary/5 transition-all text-base"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Link to="#" className="text-xs font-bold text-primary hover:opacity-80">
                                        Forgot?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            size="xl"
                            className="w-full group"
                            isLoading={isLoading}
                        >
                            Sign Into Dashboard
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                                <span className="bg-background px-4 text-muted-foreground">Or Connect With</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center h-14 rounded-2xl border border-border/50 bg-card hover:bg-secondary transition-all hover:shadow-lg active:scale-95 group">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 group-hover:scale-110 transition-transform" alt="Google" />
                            </button>
                            <button type="button" className="flex items-center justify-center h-14 rounded-2xl border border-border/50 bg-card hover:bg-secondary transition-all hover:shadow-lg active:scale-95 group text-foreground">
                                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="h-5 w-5 group-hover:scale-110 transition-transform dark:invert" alt="Apple" />
                            </button>
                        </div>

                        <div className="text-center text-sm pt-4">
                            <span className="text-muted-foreground font-medium">New to WBSP? </span>
                            <Link to="/register" className="font-black text-primary hover:opacity-80 unde">
                                Create Premium Account
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
