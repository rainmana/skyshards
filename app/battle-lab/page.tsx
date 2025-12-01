import { BattleLabView } from "@/components/battle-lab/battle-lab-view";
import { Aircraft } from "@/lib/supabase/types";
import { getAircraftForUser } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/auth";

export default async function BattleLabPage() {
  const user = await getCurrentUser();
  
  // Fetch all aircraft visible to user (Master + Custom)
  const aircraftData: Aircraft[] = await getAircraftForUser(user?.id || null);

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

