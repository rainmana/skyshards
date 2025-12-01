import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RarityChart } from "@/components/dashboard/rarity-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  
  // Fetch all aircraft data
  let aircraftData = [];
  
  try {
    const { data: aircraft, error } = await supabase
      .from("aircraft")
      .select("*");

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

