// Database types matching the new schema

export type Rarity = 'Common' | 'Rare' | 'Ultra' | 'Legendary';

export interface Aircraft {
  id: string; // UUID
  icao: string;
  name: string;
  category: string;
  subcategory: string | null;
  rarity: Rarity;
  speed: number | null;
  range: number | null;
  ceiling: number | null;
  weight: number | null;
  rarity_score: number | null;
  created_by: string | null; // UUID or NULL (NULL = Master record)
  created_at?: string;
  updated_at?: string;
}

export interface UserCollection {
  id: string; // UUID
  user_id: string; // UUID, FK to auth.users
  aircraft_id: string; // UUID, FK to aircraft.id
  caught: boolean;
  obtained_at: string | null;
  created_at?: string;
  updated_at?: string;
}

// Extended type for aircraft with collection status
export interface AircraftWithCollection extends Aircraft {
  caught: boolean; // From user_collection join
  collection_id?: string; // user_collection.id if exists
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      aircraft: {
        Row: Aircraft;
        Insert: Omit<Aircraft, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Aircraft, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_collection: {
        Row: UserCollection;
        Insert: Omit<UserCollection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserCollection, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

