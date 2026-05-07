import { db, MutationRequest } from '../lib/db';
import { supabase } from '../lib/supabase';

class SyncManager {
    private isSyncing = false;
    private pullInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Auto-start listeners if in browser
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                console.log('Online detected: processing queue.');
                this.processQueue();
                this.pullUpdates();
            });

            // Initial Sync
            this.pullUpdates();

            // Periodic Pull (every 5 minutes)
            this.pullInterval = setInterval(() => this.pullUpdates(), 5 * 60 * 1000);

            // Realtime Scavenger (Passive Sync)
            this.initializeRealtimeSubscription();
        }
    }

    private initializeRealtimeSubscription() {
        supabase.channel('public:jobs')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'jobs' },
                async (payload) => {
                    console.log('Realtime change received:', payload);
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        // Type check or cast to match LocalJob
                        const job = payload.new as any;
                        await db.jobs.put({ ...job, sync_status: 'synced' });
                    } else if (payload.eventType === 'DELETE') {
                        if (payload.old && payload.old.id) {
                            await db.jobs.delete(payload.old.id as string);
                        }
                    }
                }
            )
            .subscribe();
    }

    // --- PUSH: Process Offline Mutations ---
    async processQueue() {
        if (this.isSyncing) return;

        // Simple connectivity check
        if (!navigator.onLine) return;

        this.isSyncing = true;

        try {
            const mutations = await db.mutations
                .where('status')
                .equals('pending')
                .toArray();

            for (const mutation of mutations) {
                try {
                    await this.executeMutation(mutation);

                    // On success, delete from queue
                    await db.mutations.delete(mutation.id!);
                } catch (error) {
                    console.error("Mutation failed:", error);
                    // Update retry count or status
                    await db.mutations.update(mutation.id!, {
                        retry_count: (mutation.retry_count || 0) + 1,
                        // If too many retries, maybe mark 'failed' to stop blocking?
                        // For now we keep it pending but maybe log it.
                    });
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    private async executeMutation(mutation: MutationRequest) {
        const { table, type, data } = mutation;

        // Map local table names to Supabase table names if different
        const supabaseTable = table === 'profiles' ? 'users' : table;

        if (type === 'CREATE' && table !== 'profiles') {
            let payload = { ...data };

            // Special handling for Jobs with pending file uploads
            if (table === 'jobs') {
                const pendingFiles = await db.pending_uploads.where('job_id').equals(payload.id).toArray();

                if (pendingFiles.length > 0) {
                    const images: string[] = [];
                    let voiceNoteUrl = null;

                    for (const upload of pendingFiles) {
                        const fileName = `${payload.customer_id}/${payload.id}/${Date.now()}_${upload.field_name}`;

                        // Upload to Supabase Storage
                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('job-media')
                            .upload(fileName, upload.file);

                        if (uploadError) throw uploadError;

                        // Get Public URL
                        const { data: { publicUrl } } = supabase.storage
                            .from('job-media')
                            .getPublicUrl(fileName);

                        if (upload.field_name === 'images') {
                            images.push(publicUrl);
                        } else if (upload.field_name === 'voice_note') {
                            voiceNoteUrl = publicUrl;
                        }

                        // Cleanup pending upload
                        await db.pending_uploads.delete(upload.id!);
                    }

                    // Update Payload with Real URLs
                    if (images.length > 0) payload.images = images;
                    if (voiceNoteUrl) payload.voice_note_url = voiceNoteUrl;
                }
            }

            const { error } = await supabase.from(supabaseTable).insert(payload);
            if (error) throw error;
        } else if (type === 'UPDATE' || type === 'CREATE') { // UPSERT for profiles and general updates
            const { id, ...updates } = data;
            if (!id) throw new Error("Mutation requires ID");
            const { error } = await supabase.from(supabaseTable).upsert({ id, ...updates });
            if (error) throw error;
        } else if (type === 'DELETE') {
            const { id } = data;
            const { error } = await supabase.from(supabaseTable).delete().eq('id', id);
            if (error) throw error;
        }
    }

    // --- PULL: Fetch Updates from Server ---
    async pullUpdates() {
        if (!navigator.onLine) return;

        // 1. Pull Jobs using last updated logic (simplified: fetch all active for now to be safe)
        // Optimization: In prod, store 'lastSyncTime' in localStorage and query .gt('updated_at', lastSyncTime)

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Can't pull if not auth'd

        // Fetch User's Jobs (Customer or Worker)
        const { data: userJobs } = await supabase
            .from('jobs')
            .select('*')
            .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
            .order('updated_at', { ascending: false })
            .limit(50);

        // Fetch Available Jobs (for Workers to discover)
        // In a real app, strict RLS would handle this, but for sync we want to be explicit
        const { data: openJobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(50);

        const allJobs = [...(userJobs || []), ...(openJobs || [])];

        // Dedup by ID
        const uniqueJobs = Array.from(new Map(allJobs.map(item => [item.id, item])).values());

        if (uniqueJobs.length > 0) {
            await db.jobs.bulkPut(uniqueJobs.map(j => ({ ...j, sync_status: 'synced' })));
        }

        // Fetch Recent Messages (For active jobs)
        // Complex query simplified: Get messages for jobs involved
        // For this demo, we might just assume caching happens on view.
    }

    // --- HELPER: Add to Queue ---
    async enqueueMutation(table: 'jobs' | 'messages' | 'profiles', type: 'CREATE' | 'UPDATE' | 'DELETE', data: any) {
        // 1. Optimistic UI: Apply to local DB immediately
        if (table === 'jobs') {
            if (type === 'CREATE' || type === 'UPDATE') {
                await db.jobs.put({ ...data, sync_status: 'pending', updated_at: new Date().toISOString() });
            }
        } else if (table === 'profiles') {
            if (type === 'CREATE' || type === 'UPDATE') {
                await db.profiles.put({ ...data, updated_at: new Date().toISOString() });
            }
        }

        // 2. Add to Queue
        await db.mutations.add({
            table,
            type,
            data,
            status: 'pending',
            retry_count: 0,
            timestamp: Date.now()
        });

        // 3. Try to process immediately
        this.processQueue();
    }

    // --- UTILITY: Clear all local data (Logout) ---
    async clearAllData() {
        console.log('SyncManager: Clearing all local data...');
        await Promise.all([
            db.jobs.clear(),
            db.profiles.clear(),
            db.messages.clear(),
            db.mutations.clear(),
            db.pending_uploads.clear()
        ]);
        console.log('SyncManager: Local data cleared.');
    }
}

export const syncService = new SyncManager();
