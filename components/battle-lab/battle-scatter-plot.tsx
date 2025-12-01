"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Aircraft } from "@/lib/supabase/types";

interface AircraftWithWinRate extends Aircraft {
  win_rate: number;
}

interface BattleScatterPlotProps {
  aircraft: AircraftWithWinRate[];
}

const COLORS = {
  Common: "#cbd5e1",
  Rare: "#7dd3fc",
  Ultra: "#818cf8",
  Legendary: "#fbbf24",
};

export function BattleScatterPlot({ aircraft }: BattleScatterPlotProps) {
  const data = aircraft
    .filter((a) => a.rarity_score !== null && a.rarity_score !== undefined)
    .map((a) => ({
      x: a.rarity_score || 0,
      y: a.win_rate,
      name: a.name,
      icao: a.icao,
      rarity: a.rarity,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {data.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {data.icao}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Rating: {data.x.toFixed(2)}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Win Rate: {data.y.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Rarity Score"
            label={{ value: "Rarity Score", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Win Rate"
            label={{ value: "Win Rate (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Aircraft" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.rarity as keyof typeof COLORS] || "#8884d8"}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

