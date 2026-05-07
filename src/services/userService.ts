import { supabase } from '../lib/supabase';

export const userService = {
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async updateUserProfile(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getWorkerProfile(userId: string) {
        const { data, error } = await supabase
            .from('worker_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async updateWorkerProfile(userId: string, updates: any) {
        // Check if exists first (upsert)
        const { data, error } = await supabase
            .from('worker_profiles')
            .upsert({ user_id: userId, ...updates })
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
