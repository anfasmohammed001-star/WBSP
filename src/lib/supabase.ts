import { createClient } from '@supabase/supabase-js';

// Access environment variables (Vite standard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Initialization:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'none'
});

if (!supabaseUrl || !supabaseAnonKey) {
    // We don't throw error to allow app to load in dev with dummy data, 
    // but we warn the developer.
    console.warn('Missing Supabase Environment Variables. Check .env');
}

// detect if we should use the local proxy to bypass DNS issues
const isDev = import.meta.env.MODE === 'development' || import.meta.env.DEV;
const effectiveUrl = (isDev && typeof window !== 'undefined')
    ? `${window.location.origin}/supabase-proxy`
    : (supabaseUrl || 'https://placeholder.supabase.co');

console.log('Supabase Mode:', isDev ? 'Development (Proxy Enabled)' : 'Production');
console.log('Effective URL:', effectiveUrl);

// Create single supabase client for interacting with your database
export const supabase = createClient(
    effectiveUrl,
    supabaseAnonKey || 'placeholder-key'
);

