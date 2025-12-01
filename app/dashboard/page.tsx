import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RarityChart } from "@/components/dashboard/rarity-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { AircraftWithCollection } from "@/lib/supabase/types";
import { getAircraftWithCollection } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Fetch all aircraft visible to user (Master + Custom) with collection status
  const aircraftData: AircraftWithCollection[] = await getAircraftWithCollection(user?.id || null);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Command Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          Welcome to the SkyShards Analytics Hub. Monitor your collection progress,
          analyze fleet composition, and track your rarest aircraft.
        </p>
      </div>

      <DashboardStats aircraft={aircraftData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Collection by Rarity
          </h3>
          <RarityChart aircraft={aircraftData} />
        </div>

        <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Fleet Composition by Category
          </h3>
          <CategoryChart aircraft={aircraftData} />
        </div>
      </div>
    </div>
  );
}

