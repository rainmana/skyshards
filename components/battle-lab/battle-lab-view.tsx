"use client";

import { useMemo } from "react";
import { Aircraft } from "@/lib/supabase/types";
import { BattleScatterPlot } from "./battle-scatter-plot";
import { BattleDataTable } from "./battle-data-table";

interface BattleLabViewProps {
  aircraft: Aircraft[];
}

// Simulate win_rate if not available in the database
function calculateWinRate(aircraft: Aircraft): number {
  // For now, simulate based on rarity_score and other factors
  // In a real implementation, this would come from the database
  const baseRate = aircraft.rarity_score ? aircraft.rarity_score * 0.1 : 0.5;
  const randomFactor = Math.random() * 0.3;
  return Math.min(100, Math.max(0, (baseRate + randomFactor) * 100));
}

export function BattleLabView({ aircraft }: BattleLabViewProps) {
  // Add simulated win_rate to aircraft data
  const aircraftWithStats = useMemo(() => {
    return aircraft.map((a) => ({
      ...a,
      win_rate: calculateWinRate(a),
    }));
  }, [aircraft]);

  // Get top 50 performing aircraft
  const topAircraft = useMemo(() => {
    return [...aircraftWithStats]
      .sort((a, b) => {
        const aScore = a.rarity_score || 0;
        const bScore = b.rarity_score || 0;
        return bScore - aScore;
      })
      .slice(0, 50);
  }, [aircraftWithStats]);

  return (
    <>
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Performance Matrix
        </h3>
        <BattleScatterPlot aircraft={aircraftWithStats} />
      </div>

      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Battle Roster (Top 50)
        </h3>
        <BattleDataTable aircraft={topAircraft} />
      </div>
    </>
  );
}

