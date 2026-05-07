import { supabase } from '../lib/supabase';

export const jobMediaService = {
    async uploadMedia(jobId: string, file: File) {
        // 1. Upload to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${jobId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('job-media')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('job-media')
            .getPublicUrl(filePath);

        // 3. Create Record in DB
        const { data, error } = await supabase
            .from('job_media')
            .insert({
                job_id: jobId,
                media_url: publicUrl,
                media_type: file.type.startsWith('image/') ? 'image' : 'video'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
