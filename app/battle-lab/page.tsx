import { createClient } from "@/lib/supabase/server";
import { BattleLabView } from "@/components/battle-lab/battle-lab-view";
import { Aircraft } from "@/lib/supabase/types";

export default async function BattleLabPage() {
  const supabase = await createClient();
  
  // Fetch all aircraft data
  let aircraftData: Aircraft[] = [];
  
  try {
    const { data: aircraft, error } = await supabase
      .from("aircraft")
      .select("*")
      .order("rarity_score", { ascending: false });

    if (error) {
      console.error("Error fetching aircraft:", error);
    } else {
      aircraftData = aircraft || [];
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Battle Lab Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-4xl">
          Identify outliers: Aircraft with high performance relative to their rarity
          score. Use the scatter plot to find undervalued gems for specific metas.
        </p>
      </div>

      <BattleLabView aircraft={aircraftData} />
    </div>
  );
}

