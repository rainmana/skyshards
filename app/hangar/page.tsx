import { HangarView } from "@/components/hangar/hangar-view";
import { AircraftWithCollection } from "@/lib/supabase/types";
import { getAircraftWithCollection } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function HangarPage() {
  const user = await getCurrentUser();
  
  // Fetch all aircraft visible to user (Master + Custom) with collection status
  const aircraftData: AircraftWithCollection[] = await getAircraftWithCollection(user?.id || null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Hangar
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Explore your aircraft collection. Filter by rarity, category, or search
          by name or ICAO code.
        </p>
      </div>

      <HangarView initialAircraft={aircraftData} />
    </div>
  );
}

