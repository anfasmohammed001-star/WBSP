import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { syncService } from '../services/syncService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string, userType: any, fullName: string, workTypes?: string[]) => Promise<any>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const isRegistering = useRef(false);
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            console.log("AuthProvider: Starting fast session check...");

            try {
                // 1. Check local storage key directly for instant decision
                const projectId = 'cwkzwvaobqayuvgirvqn';
                const storageKey = `sb-${projectId}-auth-token`;
                const hasLocalSession = !!localStorage.getItem(storageKey);

                if (!hasLocalSession) {
                    console.log("AuthProvider: No local session found, skipping loader.");
                    if (mounted) setState(prev => ({ ...prev, isLoading: false }));
                    return;
                }

                // 2. We have a local session, try to get user data from cache FIRST
                const user = await authService.getCurrentUser();

                if (mounted) {
                    if (user) {
                        console.log("AuthProvider: Session restored from cache");
                        setState({ user: user as User, isAuthenticated: true, isLoading: false });
                    } else {
                        // Cache failed or session invalid
                        setState({ user: null, isAuthenticated: false, isLoading: false });
                    }
                }
            } catch (error) {
                console.error("AuthProvider: Session check catch", error);
                if (mounted) setState({ user: null, isAuthenticated: false, isLoading: false });
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log("AuthProvider: Auth event:", event);

            if (isRegistering.current) return;

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                if (session?.user) {
                    // Try to get enriched profile without blocking
                    authService.getCurrentUser().then(user => {
                        if (mounted && user) {
                            setState({ user: user as User, isAuthenticated: true, isLoading: false });
                        }
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                setState({ user: null, isAuthenticated: false, isLoading: false });
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        isRegistering.current = true; // Block listener to prevent dual-state updates
        // Do NOT set global Loading state here. Let the UI handle it locally.
        try {
            console.log("AuthProvider: Initiating secure login...");
            const data = await authService.login(email, password);
            const user = data?.user;

            if (data?.user) {
                // Determine user role from metadata safely, prefer enriched profile
                const profile = data.enrichedProfile;
                const userType = profile?.user_type || data.user.user_metadata?.user_type || 'customer';

                // Construct immediate session user to unlock UI instantly
                const sessionUser: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
                    userType: userType as any,
                    avatarUrl: profile?.avatar_url || `https://ui-avatars.com/api/?name=${data.user.email}`,
                };

                // Update state IMMEDIATELY to trigger redirect
                setState({
                    user: sessionUser,
                    isAuthenticated: true,
                    isLoading: false
                });

                // Perform heavy background tasks AFTER UI is unlocked
                setTimeout(() => {
                    syncService.pullUpdates()
                        .then(() => authService.getCurrentUser()) // Final enrichment
                        .then(fullProfile => {
                            if (fullProfile) setState(prev => ({ ...prev, user: fullProfile }));
                        })
                        .catch(e => console.warn("Background auth enrichment failed", e));
                }, 100);
            }

            return data;
        } catch (error) {
            // Do not toggle isLoading here either, as we didn't toggle it on.
            throw error;
        } finally {
            isRegistering.current = false;
        }
    };

    const register = async (email: string, password: string, userType: any, fullName: string, workTypes: string[] = []) => {
        isRegistering.current = true; // Block listener
        // Do NOT set global loading state here.
        try {
            console.log("AuthProvider: Starting registration flow...");
            const data = await authService.register(email, password, userType, fullName, workTypes);

            if (data?.user) {
                console.log("AuthProvider: Registration successful. Auto-logging in.");

                // Construct session user immediately for instant UI feedback
                const sessionUser: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    fullName: fullName,
                    userType: userType as any,
                    avatarUrl: `https://ui-avatars.com/api/?name=${data.user.email}`,
                    skills: workTypes // Add skills/workTypes to session user
                };

                setState({
                    user: sessionUser,
                    isAuthenticated: true,
                    isLoading: false
                });

                // Initial sync in background
                setTimeout(() => {
                    syncService.pullUpdates().catch(e => console.warn("Initial sync warning:", e));
                }, 100);
            } else {
                // No user returned
            }

            return data;
        } catch (error) {
            console.error("AuthProvider: Registration error", error);
            // Do not toggle isLoading
            throw error;
        } finally {
            isRegistering.current = false;
        }
    };

    const logout = async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            // 1. Wipe local database for security
            await syncService.clearAllData();

            // 2. Call Supabase SignOut
            await authService.logout();
            // State update handled by listener
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const updateUser = (data: Partial<User>) => {
        if (state.user) {
            setState((prev) => ({
                ...prev,
                user: { ...prev.user!, ...data },
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
