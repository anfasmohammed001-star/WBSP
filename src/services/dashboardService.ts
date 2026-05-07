import { db } from '../lib/db';
import { syncService } from './syncService';
import { supabase } from '../lib/supabase';

export const dashboardService = {
    // Get Stats for Customer
    async getCustomerStats(userId: string) {
        // Trigger background pull to refresh local Dexie DB
        syncService.pullUpdates().catch(console.error);
        if (!navigator.onLine) {
            // Offline Fallback: Calculate from local DB
            const allJobs = await db.jobs.where('customer_id').equals(userId).toArray();
            const pendingJobs = allJobs.filter(j => j.status === 'open').length;
            const completedJobs = allJobs.filter(j => j.status === 'completed').length;
            const totalSpent = allJobs
                .filter(j => j.status === 'completed')
                .reduce((sum, j) => sum + (j.budget || 0), 0);

            return { pendingJobs, completedJobs, totalSpent };
        }

        // 1. Pending Jobs
        const { count: pendingCount, error: pendingError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', userId)
            .eq('status', 'open');

        if (pendingError) throw pendingError;

        // 2. Completed Jobs
        const { count: completedCount, error: completedError } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', userId)
            .eq('status', 'completed');

        if (completedError) throw completedError;

        // 3. Total Spent (Approximate summing)
        const { data: spentData, error: spentError } = await supabase
            .from('jobs')
            .select('budget')
            .eq('customer_id', userId)
            .eq('status', 'completed');

        if (spentError) throw spentError;

        const totalSpent = spentData?.reduce((sum, job) => sum + (job.budget || 0), 0) || 0;

        return {
            pendingJobs: pendingCount || 0,
            completedJobs: completedCount || 0,
            totalSpent: totalSpent
        };
    },

    // Get Recent Activity for Customer
    async getCustomerActivity(userId: string) {
        if (!navigator.onLine) {
            return await db.jobs
                .where('customer_id')
                .equals(userId)
                .reverse()
                .sortBy('created_at')
                .then(jobs => jobs.slice(0, 5));
        }

        const { data, error } = await supabase
            .from('jobs')
            .select('id, title, status, created_at')
            .eq('customer_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;
        // Cache it
        await db.jobs.bulkPut(data.map(d => ({ ...d, sync_status: 'synced' } as any)));
        return data;
    },

    // Get Stats for Worker
    async getWorkerStats(userId: string) {
        // Worker profiles sync is tricky, usually online only for ratings.
        // We return cached defaults if offline.
        if (!navigator.onLine) {
            return {
                rating: 5.0,
                jobsCompleted: 0,
                earnings: { month: 0 }
            };
        }

        const { data: profile, error } = await supabase
            .from('worker_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !profile) {
            return {
                rating: 5.0,
                jobsCompleted: 0,
                earnings: {
                    month: 0
                }
            };
        }

        return {
            rating: profile.rating,
            jobsCompleted: profile.jobs_completed,
            earnings: {
                month: profile.earnings_total // Simplified for demo
            }
        };
    },

    // Get Active Jobs (For Worker Dashboard)
    async getWorkerActiveJobs(userId: string) {
        if (!navigator.onLine) {
            return await db.jobs
                .where('worker_id')
                .equals(userId)
                .filter(j => ['assigned', 'in_progress'].includes(j.status))
                .reverse()
                .sortBy('created_at');
        }

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('worker_id', userId)
            .in('status', ['assigned', 'in_progress'])
            .order('created_at', { ascending: false });

        if (error) throw error;
        await db.jobs.bulkPut(data.map(d => ({ ...d, sync_status: 'synced' } as any)));
        return data;
    }
};
