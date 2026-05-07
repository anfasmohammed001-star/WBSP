import Dexie, { Table } from 'dexie';

// Define Interface Types for Local Data
export interface LocalProfile {
    id: string; // UUID from Supabase
    email?: string;
    full_name?: string;
    user_type?: 'customer' | 'worker' | 'supervisor';
    work_types?: string[];
    avatar_url?: string;
    gender?: string;
    dob?: string;
    mobile?: string;
    updated_at: string;
}

export interface LocalJob {
    id: string;
    customer_id: string;
    worker_id?: string;
    title: string;
    description?: string;
    status: string;
    budget?: number;
    location_address?: string;
    scheduled_date?: string;
    job_type?: string;
    images?: string[]; // Local object URLs or Remote URLs
    voice_note_url?: string;
    created_at?: string;
    updated_at: string;
    sync_status?: 'synced' | 'pending'; // Internal flag
}

export interface LocalMessage {
    id: string;
    job_id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    created_at: string;
    is_read?: boolean;
}

export interface PendingUpload {
    id?: number;
    job_id: string;
    file: Blob;
    field_name: 'images' | 'voice_note';
    local_url: string; // The blob URL used temporarily
    timestamp: number;
}

export interface MutationRequest {
    id?: number; // Auto-increment
    table: 'jobs' | 'messages' | 'profiles';
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    data: any; // The payload
    status: 'pending' | 'processing' | 'failed';
    retry_count: number;
    timestamp: number;
}

export class WBSPDatabase extends Dexie {
    // Table definitions
    profiles!: Table<LocalProfile>;
    jobs!: Table<LocalJob>;
    messages!: Table<LocalMessage>;
    mutations!: Table<MutationRequest>;
    pending_uploads!: Table<PendingUpload>;

    constructor() {
        super('wbsp');

        // Define Schema
        this.version(1).stores({
            profiles: 'id, user_type',
            jobs: 'id, status, customer_id, worker_id, sync_status',
            messages: 'id, job_id, created_at',
            mutations: '++id, table, status, timestamp',
            pending_uploads: '++id, job_id'
        });
    }
}

export const db = new WBSPDatabase();
