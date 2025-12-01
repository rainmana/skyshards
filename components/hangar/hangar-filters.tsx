"use client";

import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HangarFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  rarities: string[];
  selectedRarities: string[];
  onRarityChange: (rarities: string[]) => void;
  showOnlyMissing: boolean;
  onShowOnlyMissingChange: (value: boolean) => void;
  resultCount: number;
}

const rarityColors: Record<string, string> = {
  Common: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  Rare: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  Ultra: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
  Legendary: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
};

export function HangarFilters({
  search,
  onSearchChange,
  rarities,
  selectedRarities,
  onRarityChange,
  showOnlyMissing,
  onShowOnlyMissingChange,
  resultCount,
}: HangarFiltersProps) {
  const toggleRarity = (rarity: string) => {
    if (selectedRarities.includes(rarity)) {
      onRarityChange(selectedRarities.filter((r) => r !== rarity));
    } else {
      onRarityChange([...selectedRarities, rarity]);
    }
  };

  return (
    <div className="glass rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800 sticky top-20 z-30">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or ICAO..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
          {/* Rarity Filters */}
          <div className="flex flex-wrap gap-2">
            {rarities.map((rarity) => (
              <Badge
                key={rarity}
                variant={selectedRarities.includes(rarity) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedRarities.includes(rarity)
                    ? rarityColors[rarity] || ""
                    : ""
                }`}
                onClick={() => toggleRarity(rarity)}
              >
                {rarity}
              </Badge>
            ))}
          </div>

          {/* Show Only Missing */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-missing"
              checked={showOnlyMissing}
              onCheckedChange={(checked) =>
                onShowOnlyMissingChange(checked === true)
              }
            />
            <Label
              htmlFor="show-missing"
              className="text-sm font-medium cursor-pointer"
            >
              Show Only Missing
            </Label>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
        Showing {resultCount.toLocaleString()} aircraft
      </div>
    </div>
  );
}

