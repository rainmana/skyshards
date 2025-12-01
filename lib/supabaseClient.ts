import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Type definition for the aircraft table
export interface Aircraft {
  icao: string;
  name: string;
  category: string;
  subcategory: string;
  rarity: 'Common' | 'Rare' | 'Ultra' | 'Legendary';
  caught: boolean;
  speed: number | null;
  range: number | null;
  ceiling: number | null;
  weight: number | null;
  rarity_score: number | null;
}

// For client-side usage
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using fallback client.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// For server-side usage
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not found. Using placeholder client.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

