// Legacy file - maintained for backward compatibility
// New code should use lib/supabase/client.ts or lib/supabase/server.ts

export type {
  Aircraft,
  UserCollection,
  AircraftWithCollection,
  Rarity,
} from './supabase/types';

// Re-export for backward compatibility
export { createClient as createSupabaseClient } from './supabase/client';
export { createClient as createServerSupabaseClient } from './supabase/server';
