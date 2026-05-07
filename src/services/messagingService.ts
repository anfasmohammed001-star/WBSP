import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { syncService } from './syncService';
import { v4 as uuidv4 } from 'uuid';

export const messagingService = {
    async sendMessage(jobId: string, senderId: string, recipientId: string, content: string) {
        const newMessageId = uuidv4();
        const newMessage = {
            id: newMessageId,
            job_id: jobId,
            sender_id: senderId,
            recipient_id: recipientId,
            content: content,
            created_at: new Date().toISOString(),
            is_read: false
        };

        // 1. Local Write
        await db.messages.add(newMessage);

        // 2. Queue Sync
        await syncService.enqueueMutation('messages', 'CREATE', newMessage);

        return newMessage;
    },

    async getMessages(jobId: string) {
        // 1. Local Read
        let localMessages = await db.messages
            .where('job_id')
            .equals(jobId)
            .sortBy('created_at');

        // 2. Background Refresh if Online
        if (navigator.onLine) {
            // Ideally we check last sync time, but simple fetch for now
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('job_id', jobId)
                .order('created_at', { ascending: true });

            if (data && !error) {
                // Update local cache
                await db.messages.bulkPut(data);
                // Return fresh data or let UI react to DB change? 
                // For simplicity, return mixed or fresh
                return data;
            }
        }
        return localMessages;
    },

    subscribeToMessages(jobId: string, callback: (payload: any) => void) {
        // We still listen to Supabase for incoming messages from OTHERS
        return supabase
            .channel(`job-messages-${jobId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `job_id=eq.${jobId}`
                },
                async (payload) => {
                    // Cache the incoming message locally too
                    if (payload.new) {
                        await db.messages.put(payload.new as any);
                    }
                    callback(payload);
                }
            )
            .subscribe();
    }
};
