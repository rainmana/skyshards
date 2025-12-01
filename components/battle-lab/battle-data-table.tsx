"use client";

import { useState } from "react";
import { Aircraft } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";

interface AircraftWithWinRate extends Aircraft {
  win_rate: number;
}

interface BattleDataTableProps {
  aircraft: AircraftWithWinRate[];
}

type SortField = "icao" | "name" | "rarity_score" | "win_rate";
type SortDirection = "asc" | "desc";

export function BattleDataTable({ aircraft }: BattleDataTableProps) {
  const [sortField, setSortField] = useState<SortField>("rarity_score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedAircraft = [...aircraft].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "icao":
        aValue = a.icao;
        bValue = b.icao;
        break;
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "rarity_score":
        aValue = a.rarity_score || 0;
        bValue = b.rarity_score || 0;
        break;
      case "win_rate":
        aValue = a.win_rate;
        bValue = b.win_rate;
        break;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
    >
      {children}
      {sortField === field && (
        <span className="text-xs">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  const rarityColors: Record<string, string> = {
    Common: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    Rare: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    Ultra: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Legendary: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <SortButton field="icao">ICAO</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <SortButton field="name">Aircraft</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rarity
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <SortButton field="rarity_score">Rating</SortButton>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <SortButton field="win_rate">Win Rate</SortButton>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
          {sortedAircraft.map((aircraft) => (
            <tr
              key={aircraft.icao}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900 dark:text-slate-100">
                {aircraft.icao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {aircraft.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge
                  className={
                    rarityColors[aircraft.rarity] || rarityColors.Common
                  }
                >
                  {aircraft.rarity}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-slate-700 dark:text-slate-300">
                {aircraft.rarity_score
                  ? aircraft.rarity_score.toFixed(2)
                  : "--"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700 dark:text-slate-300">
                {aircraft.win_rate.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

