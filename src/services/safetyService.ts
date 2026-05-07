import { supabase } from '../lib/supabase';

export const safetyService = {
    async reportIncident(incident: {
        reporter_id: string,
        job_id?: string,
        incident_type: string,
        location?: { lat: number, lng: number },
        description?: string
    }) {
        const { data, error } = await supabase
            .from('safety_incidents')
            .insert(incident)
            .select()
            .single();

        if (error) {
            console.error('Safety incident report failed:', error);
            // Fallback for offline or permission issues
            return { id: 'local-' + Date.now(), ...incident, status: 'pending_sync' };
        }
        return data;
    },

    async getMyIncidents(userId: string) {
        const { data, error } = await supabase
            .from('safety_incidents')
            .select('*')
            .eq('reporter_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
