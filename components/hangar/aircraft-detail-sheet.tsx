"use client";

import { AircraftWithCollection } from "@/lib/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

interface AircraftDetailSheetProps {
  aircraft: AircraftWithCollection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AircraftDetailSheet({
  aircraft,
  open,
  onOpenChange,
}: AircraftDetailSheetProps) {
  // Calculate max values for progress bars (you might want to fetch these from the database)
  const maxValues = useMemo(() => ({
    speed: 1000,
    range: 10000,
    ceiling: 50000,
    weight: 1000,
  }), []);

  const speedPercent = aircraft.speed
    ? (aircraft.speed / maxValues.speed) * 100
    : 0;
  const rangePercent = aircraft.range
    ? (aircraft.range / maxValues.range) * 100
    : 0;
  const ceilingPercent = aircraft.ceiling
    ? (aircraft.ceiling / maxValues.ceiling) * 100
    : 0;
  const weightPercent = aircraft.weight
    ? (aircraft.weight / maxValues.weight) * 100
    : 0;

  const rarityColors: Record<string, string> = {
    Common: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    Rare: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    Ultra: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Legendary: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {aircraft.name}
              </DialogTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                ICAO: {aircraft.icao}
              </p>
            </div>
            <Badge
              className={rarityColors[aircraft.rarity] || rarityColors.Common}
            >
              {aircraft.rarity}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div className="glass rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <span className="block text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              Status
            </span>
            <span
              className={`text-lg font-bold ${
                aircraft.caught
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {aircraft.caught ? "Caught" : "Uncaught"}
            </span>
          </div>

          {/* Category Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Category
            </h4>
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              {aircraft.category}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {aircraft.subcategory}
            </p>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span>Technical Specifications</span>
              <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Speed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Max Speed
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {aircraft.speed ? `${aircraft.speed} kt` : "--"}
                  </p>
                </div>
                <Progress value={speedPercent} className="h-2" />
              </div>

              {/* Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Range
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {aircraft.range ? `${aircraft.range} NM` : "--"}
                  </p>
                </div>
                <Progress value={rangePercent} className="h-2" />
              </div>

              {/* Ceiling */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Ceiling
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {aircraft.ceiling ? `${aircraft.ceiling} ft` : "--"}
                  </p>
                </div>
                <Progress value={ceilingPercent} className="h-2" />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Weight (MTOW)
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {aircraft.weight ? `${aircraft.weight} t` : "--"}
                  </p>
                </div>
                <Progress value={weightPercent} className="h-2" />
              </div>

              {/* Rarity Score */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Rarity Score
                  </p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {aircraft.rarity_score ? aircraft.rarity_score.toFixed(2) : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

