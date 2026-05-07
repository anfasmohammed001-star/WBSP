import { supabase } from '../lib/supabase';
import type { UserType, User } from '../types';
import { syncService } from './syncService';
import { db } from '../lib/db';

/**
 * Instant Auth Service:
 * Prioritizes local metadata and IndexedDB to bypass DB cold-starts.
 */

export const authService = {
    /**
     * Non-blocking wakeup to prepare the server for future requests.
     */
    async wakeUpDB() {
        // Fire and forget health check
        supabase.from('users').select('id', { count: 'exact', head: true }).limit(1).then(() => { });
    },

    async register(email: string, password: string, userType: UserType, fullName: string, workTypes: string[] = []) {
        this.wakeUpDB();
        const { data, error } = await (supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_type: userType,
                    full_name: fullName,
                    work_types: workTypes
                }
            },
        }) as any);

        if (error) throw error;

        if (data?.user) {
            const profile = {
                id: data.user.id,
                email,
                user_type: userType,
                full_name: fullName,
                work_types: workTypes,
                updated_at: new Date().toISOString()
            };

            // 1. Instant Local Save
            await db.profiles.put(profile as any);

            // 2. Background Remote Save (Wrapped in an async block to avoid catch error on builder)
            (async () => {
                try {
                    const { error: upsertError } = await supabase.from('users').upsert(profile);
                    if (upsertError) throw upsertError;

                    if (userType === 'worker') {
                        await supabase.from('worker_profiles').upsert({
                            id: data.user.id,
                            user_id: data.user.id,
                            skills: workTypes
                        });
                    }
                } catch (e) {
                    console.warn("AuthService: Background sync failed, enqueuing.");
                    syncService.enqueueMutation('profiles', 'CREATE', profile);
                }
            })();
        }

        return data;
    },

    async login(email: string, password: string) {
        if (typeof window !== 'undefined' && !navigator.onLine) {
            throw new Error("No internet connection.");
        }

        const maxRetries = 2;
        let lastError: any = null;

        for (let i = 0; i <= maxRetries; i++) {
            try {
                if (i > 0) {
                    console.log(`AuthService: Retry ${i}/${maxRetries} after network glitch...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * i)); // Exponential backoff
                }

                // Only wake up once per login attempt
                if (i === 0) this.wakeUpDB();

                console.log("AuthService: Sign-in attempt...");

                const { data, error } = await (supabase.auth.signInWithPassword({ email, password }) as any);

                if (error) {
                    // Check for network errors or empty responses (proxy issues)
                    if (error.message?.includes("fetch") ||
                        error.message?.includes("JSON") ||
                        error.code === 'TypeError' ||
                        error.status === 0) {
                        lastError = error;
                        continue; // Retry
                    }

                    if (error.message?.includes("Email not confirmed")) {
                        throw new Error("Email not confirmed. Please check your inbox for a verification link.");
                    }
                    throw error;
                }

                // Success!
                if (data?.user) {
                    const user = data.user;
                    const optimisticProfile = {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || 'User',
                        user_type: user.user_metadata?.user_type || 'customer',
                        avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`,
                        updated_at: new Date().toISOString()
                    };

                    await db.profiles.put(optimisticProfile as any);

                    (async () => {
                        try {
                            const { data: profile } = await supabase
                                .from('users')
                                .select('*')
                                .eq('id', user.id)
                                .maybeSingle();

                            if (profile) {
                                const enriched = {
                                    ...optimisticProfile,
                                    full_name: profile.full_name || optimisticProfile.full_name,
                                    user_type: profile.user_type || optimisticProfile.user_type,
                                    avatar_url: profile.profile_image_url || profile.avatar_url || optimisticProfile.avatar_url,
                                };
                                await db.profiles.put(enriched as any);
                            } else {
                                await this.healMissingProfile(user);
                            }
                        } catch (e) {
                            console.warn("AuthService: Background profile fetch failed", e);
                        }
                    })();

                    return { ...data, enrichedProfile: optimisticProfile };
                }
                return data;

            } catch (error: any) {
                lastError = error;
                if (error.message?.includes("fetch") ||
                    error.message?.includes("JSON") ||
                    error.name === 'TypeError') {
                    continue; // Retry
                }
                throw error;
            }
        }

        // If we reach here, we've exhausted retries
        console.error("AuthService: All login attempts failed due to network.", lastError);
        throw new Error(`Connection failed. Please check your internet or firewall. (Error: ${lastError?.message || 'Network Timeout'})`);
    },



    async logout() {
        await db.profiles.clear();
        await supabase.auth.signOut();
    },

    /**
     * Fast retrieval of current user.
     * Checks session, then IndexedDB cache. No network blocking.
     */
    async getCurrentUser() {
        try {
            // 1. Get session instantly from memory/local storage
            const { data: { session } } = await (supabase.auth.getSession() as any);
            if (!session || !session.user) return null;

            const authUser = session.user;

            // 2. Metadata Fallback (Instant): Construct user from session metadata + cache
            const cached = await db.profiles.get(authUser.id);
            const initialUser: User = {
                id: authUser.id,
                email: authUser.email!,
                fullName: cached?.full_name || authUser.user_metadata?.full_name || 'User',
                userType: cached?.user_type || authUser.user_metadata?.user_type || 'customer',
                avatarUrl: cached?.avatar_url || authUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${authUser.email}`,
            };

            // 3. Background Refresh: If online, update the cache and public table in background
            if (navigator.onLine) {
                this.refreshProfileInBackground(authUser.id).catch(() => { });
            }

            return initialUser;
        } catch (e) {
            console.error("AuthService: Unexpected error in getCurrentUser", e);
            return null;
        }
    },

    /**
     * Internal helper to create a public profile from auth metadata if it's missing.
     */
    async healMissingProfile(authUser: any) {
        const newProfile = {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || 'User',
            user_type: authUser.user_metadata?.user_type || 'customer',
            updated_at: new Date().toISOString()
        };

        const { data: created, error } = await supabase
            .from('users')
            .insert(newProfile)
            .select()
            .single();

        if (error) {
            console.error("AuthService: Self-healing failed", error);
            return newProfile;
        }

        await db.profiles.put(created as any);
        return created;
    },

    /**
     * Periodic background enrichment.
     */
    async refreshProfileInBackground(userId: string) {
        try {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (profile) {
                await db.profiles.put({
                    id: profile.id,
                    email: profile.email,
                    full_name: profile.full_name,
                    user_type: profile.user_type,
                    avatar_url: profile.profile_image_url || profile.avatar_url,
                    updated_at: new Date().toISOString()
                } as any);
            }
        } catch (e) {
            // Fail silently in background
        }
    }
};

