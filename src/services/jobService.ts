// Supabase Job Service - Refreshed
import { supabase } from '../lib/supabase';

import { db } from '../lib/db';
import { syncService } from './syncService';
import { v4 as uuidv4 } from 'uuid';

export interface JobData {
    title: string;
    description: string;
    category: string;
    job_type: 'scheduled' | 'spot';
    budget: number;
    urgency_level: string;
    date?: string;
    time?: string;
    location_address?: string;
}

/**
 * Resilient wrapper for Supabase RPC calls with absolute timeouts and retries.
 */
const withResilience = async <T>(fn: () => Promise<T>, timeoutMs = 20000, retries = 2): Promise<T> => {
    let lastError;
    for (let i = 0; i <= retries; i++) {
        const controller = new AbortController();
        const timeoutPromise = new Promise((_, reject) => {
            const id = setTimeout(() => {
                controller.abort();
                reject(new Error('timeout'));
            }, timeoutMs);
        });

        try {
            // Race the function against the timeout
            const result = await Promise.race([fn(), timeoutPromise]);
            return result as T;
        } catch (e: any) {
            lastError = e;
            if (e.message === 'timeout' || e.name === 'AbortError') {
                console.warn(`JobService: Request timed out, retrying (${i + 1}/${retries})...`);
                continue;
            }
            throw e;
        }
    }
    throw lastError;
};

export const jobService = {
    async createJob(customerId: string, jobData: JobData, files?: { images?: Blob[], voiceNote?: Blob }) {
        const scheduledAt = jobData.date
            ? new Date(`${jobData.date}T${jobData.time || '00:00'}`)
            : null;

        const newJobId = uuidv4();
        const createdDate = new Date().toISOString();

        // 1. Handle Files for Offline/Optimistic UI
        const images: string[] = [];
        let voiceNoteUrl: string | undefined = undefined;

        if (files) {
            if (files.images) {
                for (const file of files.images) {
                    const localUrl = URL.createObjectURL(file);
                    images.push(localUrl);
                    await db.pending_uploads.add({
                        job_id: newJobId,
                        file: file,
                        field_name: 'images',
                        local_url: localUrl,
                        timestamp: Date.now()
                    });
                }
            }
            if (files.voiceNote) {
                const localUrl = URL.createObjectURL(files.voiceNote);
                voiceNoteUrl = localUrl;
                await db.pending_uploads.add({
                    job_id: newJobId,
                    file: files.voiceNote,
                    field_name: 'voice_note',
                    local_url: localUrl,
                    timestamp: Date.now()
                });
            }
        }

        const newJob = {
            id: newJobId,
            customer_id: customerId,
            title: jobData.title,
            description: jobData.description,
            category: jobData.category.toLowerCase(), // Normalize for robust filtering
            job_type: jobData.job_type,
            budget: jobData.budget,
            urgency_level: jobData.urgency_level,
            location_address: jobData.location_address,
            scheduled_date: scheduledAt?.toISOString(),
            status: 'open',
            is_premium: true, // New jobs show up in premium feed for maximum visibility
            images: images,
            voice_note_url: voiceNoteUrl,
            created_at: createdDate,
            updated_at: createdDate
        };

        // 2. Local Write (Synchronous feel)
        await db.jobs.add({ ...newJob, sync_status: 'pending' });

        // 3. Queue Server Sync
        await syncService.enqueueMutation('jobs', 'CREATE', newJob);

        return newJob;
    },

    async getJobsByStatus(status: string = 'open') {
        // Local-First Read
        // If status is 'posted', we treat it as 'open' for now to match UI legacy
        const queryStatus = status === 'posted' ? 'open' : status;

        let jobs = await db.jobs.where('status').equals(queryStatus).toArray();

        if (jobs.length === 0 && navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('status', queryStatus)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    for (const job of data) {
                        await db.jobs.put({ ...job, sync_status: 'synced' });
                    }
                    return data;
                }
            } catch (e) {
                console.warn("JobService: Remote fetch failed, using local fallback.");
            }
        }
        return jobs;
    },

    async getAvailableJobs() {
        // Fetch only jobs that are truly available (not assigned, completed, etc)
        // Since getJobsByStatus('open') does this, we just wrap it for clarity in the UI layer
        return this.getJobsByStatus('open');
    },

    async getPremiumJobs(workerId?: string) {
        if (navigator.onLine) {
            try {
                // 1. Fetch all open premium jobs
                let query = supabase
                    .from('jobs')
                    .select('*')
                    .eq('is_premium', true)
                    .eq('status', 'open')
                    .order('created_at', { ascending: false });

                const { data: jobs, error } = await query;
                if (error) throw error;

                // 2. Fetch rejected job IDs if workerId provided
                if (workerId && jobs) {
                    const { data: rejections } = await supabase
                        .from('rejected_jobs')
                        .select('job_id')
                        .eq('worker_id', workerId);

                    if (rejections) {
                        const rejectedIds = new Set(rejections.map(r => r.job_id));
                        return jobs.filter(j => !rejectedIds.has(j.id));
                    }
                }

                return jobs || [];
            } catch (e) {
                console.warn("JobService: Remote premium fetch failed.");
            }
        }
        // Fallback or offline: search local database for premium jobs
        return await db.jobs.where('status').equals('open').filter(j => (j as any).is_premium === true).toArray();
    },

    async rejectJob(workerId: string, jobId: string) {
        const { error } = await supabase
            .from('rejected_jobs')
            .insert({ worker_id: workerId, job_id: jobId });

        if (error) throw error;

        // Also update local Dexie if necessary, though getPremiumJobs for local doesn't filter yet.
        // For now, Supabase is the truth for rejections.
        return true;
    },

    async getJobDetails(jobId: string) {
        if (navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select(`
                        *,
                        customer:users!customer_id(id, full_name, profile_image_url),
                        worker:users!worker_id(id, full_name, profile_image_url),
                        reviews:reviews(id, rating, review_text, reviewer_id, created_at)
                    `)
                    .eq('id', jobId)
                    .single();

                if (data && !error) {
                    await db.jobs.put({ ...data, sync_status: 'synced' });
                    return data;
                }
            } catch (e) {
                console.warn("JobService: Remote detail fetch failed.", e);
            }
        }
        return await db.jobs.get(jobId);
    },

    async assignWorker(jobId: string, workerId: string) {
        return withResilience(async () => {
            const { data: otp, error } = await supabase.rpc('assign_job_to_worker', {
                p_job_id: jobId,
                p_worker_id: workerId
            });

            if (error) throw error;

            // Update local state immediately
            await db.jobs.update(jobId, { worker_id: workerId, status: 'assigned' });
            return otp;
        });
    },

    async verifyJobStart(jobId: string, otp: string) {
        return withResilience(async () => {
            const { data: success, error } = await supabase.rpc('verify_job_start', {
                p_job_id: jobId,
                p_input_otp: otp
            });

            if (error) throw error;
            if (success) {
                await db.jobs.update(jobId, { status: 'in_progress' });
            }
            return success;
        });
    },

    async getTrackingDetails(jobId: string) {
        const { data, error } = await supabase
            .from('job_tracking')
            .select('*')
            .eq('job_id', jobId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async updateWorkerLocation(jobId: string, lat: number, lng: number) {
        // High frequency, low criticality (Fire and forget)
        supabase.rpc('update_location', { p_job_id: jobId, p_lat: lat, p_lng: lng }).then(res => {
            if (res.error) console.warn("Location sync fail (non-critical)");
        });
    },

    subscribeToLocation(jobId: string, onUpdate: (data: any) => void) {
        return supabase
            .channel(`tracking:${jobId}`)
            .on('broadcast', { event: 'location_update' }, ({ payload }) => onUpdate(payload))
            .subscribe();
    },

    broadcastLocation(jobId: string, role: string, lat: number, lng: number) {
        supabase.channel(`tracking:${jobId}`).send({
            type: 'broadcast',
            event: 'location_update',
            payload: { role, lat, lng }
        });
    },

    async completeJob(jobId: string) {
        return withResilience(async () => {
            const { error } = await supabase
                .from('jobs')
                .update({ status: 'completed', updated_at: new Date().toISOString() })
                .eq('id', jobId);

            if (error) throw error;

            // Update local state immediately
            await db.jobs.update(jobId, { status: 'completed' });
        });
    },

    async declineJob(jobId: string) {
        // Placeholder: In a real implementation this would likely update a 'rejected_jobs' table
        console.log(`Declining job ${jobId}`);
        return Promise.resolve();
    },

    async getWorkerJobHistory(workerId: string) {
        if (navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select(`
                        *,
                        customer:users!customer_id(id, full_name, profile_image_url),
                        reviews:reviews(rating, review_text, reviewer_id)
                    `)
                    .eq('worker_id', workerId)
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                return data;
            } catch (e) {
                console.warn("JobService: Remote history fetch failed.", e);
            }
        }
        return await db.jobs.where('worker_id').equals(workerId).reverse().sortBy('updated_at');
    }
};
