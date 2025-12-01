import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { HangarView } from "@/components/hangar/hangar-view";

export default async function HangarPage() {
  const supabase = createServerSupabaseClient();
  
  // Fetch all aircraft data
  let aircraftData = [];
  
  try {
    const { data: aircraft, error } = await supabase
      .from("aircraft")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching aircraft:", error);
    } else {
      aircraftData = aircraft || [];
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
  }

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

