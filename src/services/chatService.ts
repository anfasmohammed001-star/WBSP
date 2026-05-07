import { supabase } from '../lib/supabase';

export interface ChatMessage {
    id: string;
    job_id?: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export const chatService = {
    async sendMessage(jobId: string | undefined, senderId: string, recipientId: string, content: string) {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                job_id: jobId,
                sender_id: senderId,
                recipient_id: recipientId,
                content: content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMessages(recipientId: string, jobId?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let query = supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`);

        if (jobId) {
            query = query.eq('job_id', jobId);
        }

        const { data, error } = await query.order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    subscribeToMessages(callback: (message: ChatMessage) => void) {
        return supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    callback(payload.new as ChatMessage);
                }
            )
            .subscribe();
    }
};
