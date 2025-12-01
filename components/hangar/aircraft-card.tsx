"use client";

import { Aircraft, AircraftWithCollection } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plane } from "lucide-react";

interface AircraftCardProps {
  aircraft: Aircraft | AircraftWithCollection;
  onClick: () => void;
}

const rarityColors: Record<string, string> = {
  Common:
    "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  Rare: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  Ultra:
    "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
  Legendary:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
};

export function AircraftCard({ aircraft, onClick }: AircraftCardProps) {
  const rarityColor = rarityColors[aircraft.rarity] || rarityColors.Common;

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-xl shadow-sm border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        'caught' in aircraft && aircraft.caught
          ? "border-emerald-200 dark:border-emerald-800"
          : "border-slate-200 dark:border-slate-800 opacity-75",
        rarityColor
      )}
    >
      <div className="h-32 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
        <Plane className="h-12 w-12 text-slate-400 dark:text-slate-600 opacity-25" />
        {'caught' in aircraft && aircraft.caught && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            CAUGHT
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {aircraft.icao}
          </span>
          <Badge variant="outline" className="text-xs">
            {aircraft.rarity}
          </Badge>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1 truncate">
          {aircraft.name}
        </h3>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
          <span>{aircraft.speed ? `${aircraft.speed} kt` : "--"}</span>
          <span>{aircraft.range ? `${aircraft.range} NM` : "--"}</span>
        </div>
      </div>
    </div>
  );
}

