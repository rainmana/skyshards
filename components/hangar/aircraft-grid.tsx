"use client";

import { useState } from "react";
import { Aircraft } from "@/lib/supabaseClient";
import { AircraftCard } from "./aircraft-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AircraftGridProps {
  aircraft: Aircraft[];
  onAircraftClick: (aircraft: Aircraft) => void;
}

const ITEMS_PER_PAGE = 24;

export function AircraftGrid({ aircraft, onAircraftClick }: AircraftGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(aircraft.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAircraft = aircraft.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (aircraft.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          No aircraft found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedAircraft.map((aircraft) => (
          <AircraftCard
            key={aircraft.icao}
            aircraft={aircraft}
            onClick={() => onAircraftClick(aircraft)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400 px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}

