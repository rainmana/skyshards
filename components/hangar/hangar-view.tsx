"use client";

import { useState, useMemo } from "react";
import { Aircraft } from "@/lib/supabaseClient";
import { HangarFilters } from "./hangar-filters";
import { AircraftGrid } from "./aircraft-grid";
import { AircraftDetailSheet } from "./aircraft-detail-sheet";

interface HangarViewProps {
  initialAircraft: Aircraft[];
}

export function HangarView({ initialAircraft }: HangarViewProps) {
  const [search, setSearch] = useState("");
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null
  );

  // Get unique values for filters
  const uniqueRarities = useMemo(
    () => Array.from(new Set(initialAircraft.map((a) => a.rarity))).sort(),
    [initialAircraft]
  );

  // Filter aircraft
  const filteredAircraft = useMemo(() => {
    return initialAircraft.filter((aircraft) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        aircraft.name.toLowerCase().includes(searchLower) ||
        aircraft.icao.toLowerCase().includes(searchLower);

      // Rarity filter
      const matchesRarity =
        selectedRarities.length === 0 ||
        selectedRarities.includes(aircraft.rarity);

      // Missing filter
      const matchesMissing = !showOnlyMissing || !aircraft.caught;

      return matchesSearch && matchesRarity && matchesMissing;
    });
  }, [initialAircraft, search, selectedRarities, showOnlyMissing]);

  return (
    <>
      <HangarFilters
        search={search}
        onSearchChange={setSearch}
        rarities={uniqueRarities}
        selectedRarities={selectedRarities}
        onRarityChange={setSelectedRarities}
        showOnlyMissing={showOnlyMissing}
        onShowOnlyMissingChange={setShowOnlyMissing}
        resultCount={filteredAircraft.length}
      />

      <AircraftGrid
        aircraft={filteredAircraft}
        onAircraftClick={setSelectedAircraft}
      />

      {selectedAircraft && (
        <AircraftDetailSheet
          aircraft={selectedAircraft}
          open={!!selectedAircraft}
          onOpenChange={(open) => !open && setSelectedAircraft(null)}
        />
      )}
    </>
  );
}

