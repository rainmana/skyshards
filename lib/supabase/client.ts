import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always provide a client, even if env vars are missing
  // This prevents crashes and allows graceful error handling
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your configuration.');
    // Return a client with placeholder values - API calls will fail gracefully
    return createBrowserClient<Database>(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

