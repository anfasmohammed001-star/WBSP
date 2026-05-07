import { supabase } from '../lib/supabase';

export const realtimeService = {
    subscribeToJobStatus(jobId: string, callback: (newStatus: string) => void) {
        return supabase
            .channel(`job-status-${jobId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'jobs',
                    filter: `id=eq.${jobId}`
                },
                (payload) => {
                    if (payload.new && payload.new.status) {
                        callback(payload.new.status);
                    }
                }
            )
            .subscribe();
    },

    subscribeToNewJobs(callback: (job: any) => void) {
        return supabase
            .channel('public-jobs')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'jobs',
                    filter: `status=eq.posted`
                },
                (payload) => callback(payload.new)
            )
            .subscribe();
    },

    subscribeToJobTracking(jobId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`tracking-${jobId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'job_tracking',
                    filter: `job_id=eq.${jobId}`
                },
                (payload) => callback(payload.new)
            )
            .subscribe();
    }
};

import { db } from '../lib/db';

export function startRealtimeSync() {
    supabase
        .channel('jobs-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'jobs' },
            (payload) => {
                // Handle different event types safely
                if (payload.eventType === 'DELETE') {
                    if (payload.old && payload.old.id) {
                        db.jobs.delete(payload.old.id as string).catch(console.error);
                    }
                } else {
                    const data = payload.new as any;
                    if (data) {
                        db.jobs.put(data).catch(console.error);
                    }
                }
            }
        )
        .subscribe();
}
