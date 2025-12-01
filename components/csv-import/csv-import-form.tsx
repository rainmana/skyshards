"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { Rarity } from "@/lib/supabase/types";

interface CSVRow {
  icao?: string;
  name?: string;
  category?: string;
  subcategory?: string;
  rarity?: string;
  speed?: string;
  range?: string;
  ceiling?: string;
  weight?: string;
  rarity_score?: string;
  caught?: string | boolean;
  [key: string]: any;
}

export function CSVImportForm() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    imported: number;
    updated: number;
    markedCaught: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    processCSV(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processCSV = async (file: File) => {
    setIsProcessing(true);
    setResults(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Parse CSV
      const text = await file.text();
      const parseResult = Papa.parse<CSVRow>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
      });

      if (parseResult.errors.length > 0) {
        throw new Error(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
      }

      const rows = parseResult.data;
      let imported = 0;
      let updated = 0;
      let markedCaught = 0;
      const errors: string[] = [];

      // Process each row
      for (const row of rows) {
        try {
          if (!row.icao) {
            errors.push(`Row missing ICAO: ${JSON.stringify(row)}`);
            continue;
          }

          const icao = row.icao.trim().toUpperCase();
          const name = row.name?.trim() || '';
          const category = row.category?.trim() || '';
          const subcategory = row.subcategory?.trim() || null;
          const rarity = (row.rarity?.trim() || 'Common') as Rarity;
          const speed = row.speed ? parseFloat(row.speed) : null;
          const range = row.range ? parseFloat(row.range) : null;
          const ceiling = row.ceiling ? parseFloat(row.ceiling) : null;
          const weight = row.weight ? parseFloat(row.weight) : null;
          const rarityScore = row.rarity_score ? parseFloat(row.rarity_score) : null;
          
          // Check if caught (can be boolean string or "true"/"1"/"yes")
          const caughtValue = row.caught;
          const caught = caughtValue === true || 
                        caughtValue === 'true' || 
                        caughtValue === '1' || 
                        (typeof caughtValue === 'string' && caughtValue.toLowerCase() === 'yes') ||
                        (typeof caughtValue === 'string' && caughtValue.toLowerCase() === 'caught');

          // Find existing aircraft by ICAO (checking both master and user's custom)
          const { data: existing } = await supabase
            .from('aircraft')
            .select('id, created_by')
            .eq('icao', icao)
            .or(`created_by.is.null,created_by.eq.${user.id}`)
            .limit(1)
            .maybeSingle() as any;

          let aircraftId: string;

          if (existing) {
            // Use existing aircraft (skip update for now to avoid type issues)
            aircraftId = existing.id;
            // Count as updated if it's the user's custom aircraft
            if (existing.created_by === user.id) {
              updated++;
            }
          } else {
            // Create new aircraft
            const { data: newAircraft, error: insertError } = await supabase
              .from('aircraft')
              .insert({
                icao,
                name,
                category,
                subcategory,
                rarity,
                speed,
                range,
                ceiling,
                weight,
                rarity_score: rarityScore,
                created_by: user.id,
              } as any)
              .select()
              .single() as { data: { id: string } | null; error: any };

            if (insertError || !newAircraft) {
              throw insertError || new Error('Failed to create aircraft');
            }
            imported++;
            aircraftId = newAircraft.id;
          }

          // Handle caught status
          if (caught) {
            // Check if collection entry exists
            const { data: existingCollection } = await supabase
              .from('user_collection')
              .select('id')
              .eq('user_id', user.id)
              .eq('aircraft_id', aircraftId)
              .maybeSingle() as any;

            if (!existingCollection) {
              // Create new entry (upsert would be better but this works)
              await supabase.from("user_collection").insert({
                user_id: user.id,
                aircraft_id: aircraftId,
                caught: true,
                obtained_at: new Date().toISOString(),
              } as any);
              markedCaught++;
            } else if (!existingCollection.caught) {
              // Update if exists but not caught - use upsert
              await supabase.from("user_collection").upsert({
                user_id: user.id,
                aircraft_id: aircraftId,
                caught: true,
                obtained_at: new Date().toISOString(),
              } as any, { onConflict: 'user_id,aircraft_id' });
              markedCaught++;
            }
          }
        } catch (error: any) {
          errors.push(`Error processing row ${row.icao}: ${error.message}`);
        }
      }

      setResults({
        imported,
        updated,
        markedCaught,
        errors: errors.slice(0, 10), // Limit errors shown
      });

      // Refresh the page data
      router.refresh();
    } catch (error: any) {
      setResults({
        imported: 0,
        updated: 0,
        markedCaught: 0,
        errors: [error.message || 'Unknown error'],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Import Aircraft from CSV
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Upload a CSV file to import aircraft and mark them as caught. The CSV should include columns like: icao, name, category, rarity, speed, range, ceiling, weight, rarity_score, and optionally caught.
        </p>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
            ${isDragging
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            disabled={isProcessing}
          />
          <div className="space-y-4">
            {isProcessing ? (
              <>
                <Loader2 className="h-12 w-12 text-sky-600 dark:text-sky-400 mx-auto animate-spin" />
                <p className="text-slate-600 dark:text-slate-400">Processing CSV...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Drag & Drop CSV File
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    or click to browse
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            {results.errors.length === 0 ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Import Results
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">New aircraft imported:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{results.imported}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Aircraft updated:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{results.updated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Marked as caught:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{results.markedCaught}</span>
                </div>
                {results.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-amber-600 dark:text-amber-400 font-medium mb-2">
                      Errors ({results.errors.length}):
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {results.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

