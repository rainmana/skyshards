import { createClient } from '@/lib/supabase/server';
import { Aircraft, AircraftWithCollection } from './types';

/**
 * Fetch all aircraft visible to the current user
 * (Master records + user's custom records)
 */
export async function getAircraftForUser(userId: string | null): Promise<Aircraft[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('aircraft')
    .select('*')
    .order('name');

  // RLS will handle the filtering, but we can also add explicit filter
  if (userId) {
    query = query.or(`created_by.is.null,created_by.eq.${userId}`);
  } else {
    query = query.is('created_by', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching aircraft:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch aircraft with collection status for the current user
 */
export async function getAircraftWithCollection(
  userId: string | null
): Promise<AircraftWithCollection[]> {
  const supabase = await createClient();

  // First, get all visible aircraft
  const aircraft = await getAircraftForUser(userId);

  if (!userId || aircraft.length === 0) {
    // If no user or no aircraft, return with caught = false
    return aircraft.map((a) => ({ ...a, caught: false }));
  }

  // Get user's collection status
  const { data: collection, error } = await supabase
    .from('user_collection')
    .select('aircraft_id, caught')
    .eq('user_id', userId) as { data: Array<{ aircraft_id: string; caught: boolean }> | null; error: any };

  if (error) {
    console.error('Error fetching collection:', error);
    return aircraft.map((a) => ({ ...a, caught: false }));
  }

  // Create a map of aircraft_id -> caught status
  const collectionMap = new Map<string, boolean>();
  collection?.forEach((item: { aircraft_id: string; caught: boolean }) => {
    collectionMap.set(item.aircraft_id, item.caught);
  });

  // Merge aircraft with collection status
  return aircraft.map((a) => ({
    ...a,
    caught: collectionMap.get(a.id) || false,
  }));
}

/**
 * Get total aircraft count (Master + Custom for user)
 */
export async function getTotalAircraftCount(userId: string | null): Promise<number> {
  const aircraft = await getAircraftForUser(userId);
  return aircraft.length;
}

/**
 * Get caught aircraft count for user
 */
export async function getCaughtAircraftCount(userId: string | null): Promise<number> {
  if (!userId) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from('user_collection')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('caught', true);

  if (error) {
    console.error('Error fetching caught count:', error);
    return 0;
  }

  return count || 0;
}

