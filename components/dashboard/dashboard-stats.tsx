"use client";

import { Aircraft } from "@/lib/supabaseClient";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsProps {
  aircraft: Aircraft[];
}

export function DashboardStats({ aircraft }: DashboardStatsProps) {
  const total = aircraft.length;
  const caught = aircraft.filter((a) => a.caught).length;
  const completionPercentage = total > 0 ? (caught / total) * 100 : 0;

  // Find top rarity
  const caughtAircraft = aircraft.filter((a) => a.caught);
  const rarities = caughtAircraft.map((a) => a.rarity);
  let topRarity = "None";
  if (rarities.includes("Legendary")) topRarity = "Legendary";
  else if (rarities.includes("Ultra")) topRarity = "Ultra";
  else if (rarities.includes("Rare")) topRarity = "Rare";
  else if (rarities.length > 0) topRarity = "Common";

  // Count by rarity
  const rarityCounts = aircraft.reduce(
    (acc, a) => {
      acc[a.rarity] = (acc[a.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const legendaryCount = rarityCounts["Legendary"] || 0;
  const ultraCount = rarityCounts["Ultra"] || 0;
  const rareCount = rarityCounts["Rare"] || 0;
  const commonCount = rarityCounts["Common"] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Aircraft */}
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Aircraft
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="mt-4">
          <Progress value={completionPercentage} className="h-2.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
            {completionPercentage.toFixed(1)}% Caught ({caught})
          </p>
        </div>
      </div>

      {/* Top Rarity */}
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Top Rarity
        </p>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 truncate">
          {topRarity}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Highest tier acquired
        </p>
      </div>

      {/* Legendary Count */}
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Legendary
        </p>
        <p className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
          {legendaryCount}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Ultra rare aircraft
        </p>
      </div>

      {/* Ultra Count */}
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Ultra Rare
        </p>
        <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">
          {ultraCount}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Premium aircraft
        </p>
      </div>
    </div>
  );
}

