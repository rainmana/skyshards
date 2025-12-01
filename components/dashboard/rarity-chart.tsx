"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Aircraft } from "@/lib/supabase/types";

interface RarityChartProps {
  aircraft: Aircraft[];
}

const COLORS = {
  Common: "#cbd5e1",
  Rare: "#7dd3fc",
  Ultra: "#818cf8",
  Legendary: "#fbbf24",
};

export function RarityChart({ aircraft }: RarityChartProps) {
  const rarityCounts = aircraft.reduce(
    (acc, a) => {
      acc[a.rarity] = (acc[a.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(rarityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

