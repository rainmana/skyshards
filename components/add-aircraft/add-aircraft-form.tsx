"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rarity } from "@/lib/supabase/types";

interface AddAircraftFormProps {
  userId: string;
}

export function AddAircraftForm({ userId }: AddAircraftFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    icao: "",
    name: "",
    category: "",
    subcategory: "",
    rarity: "Common" as Rarity,
    speed: "",
    range: "",
    ceiling: "",
    weight: "",
    rarity_score: "",
    autoCatch: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Insert aircraft
      const aircraftInsert = {
        icao: formData.icao.toUpperCase(),
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory || null,
        rarity: formData.rarity,
        speed: formData.speed ? parseFloat(formData.speed) : null,
        range: formData.range ? parseFloat(formData.range) : null,
        ceiling: formData.ceiling ? parseFloat(formData.ceiling) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        rarity_score: formData.rarity_score
          ? parseFloat(formData.rarity_score)
          : null,
        created_by: userId,
      };

      const { data: aircraft, error: aircraftError } = await supabase
        .from("aircraft")
        .insert(aircraftInsert as any)
        .select()
        .single() as { data: { id: string } | null; error: any };

      if (aircraftError || !aircraft) {
        setError(aircraftError?.message || "Failed to create aircraft");
        setLoading(false);
        return;
      }

      // Optionally auto-catch the aircraft
      if (formData.autoCatch && aircraft.id) {
        await supabase.from("user_collection").insert({
          user_id: userId,
          aircraft_id: aircraft.id,
          caught: true,
          obtained_at: new Date().toISOString(),
        } as any);
      }

      setSuccess(true);
      setFormData({
        icao: "",
        name: "",
        category: "",
        subcategory: "",
        rarity: "Common",
        speed: "",
        range: "",
        ceiling: "",
        weight: "",
        rarity_score: "",
        autoCatch: true,
      });

      // Refresh the page to show new aircraft
      setTimeout(() => {
        router.refresh();
        router.push("/hangar");
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ICAO */}
            <div>
              <Label htmlFor="icao">ICAO Code *</Label>
              <Input
                id="icao"
                value={formData.icao}
                onChange={(e) =>
                  setFormData({ ...formData, icao: e.target.value.toUpperCase() })
                }
                required
                maxLength={10}
                placeholder="B738"
                disabled={loading}
                className="mt-1 font-mono"
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Aircraft Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="BOEING 737-800"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                placeholder="Jet & Rocket"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Subcategory */}
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                placeholder="Twin Engine"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Rarity */}
            <div>
              <Label htmlFor="rarity">Rarity *</Label>
              <select
                id="rarity"
                value={formData.rarity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rarity: e.target.value as Rarity,
                  })
                }
                required
                disabled={loading}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Ultra">Ultra</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>

            {/* Speed */}
            <div>
              <Label htmlFor="speed">Max Speed (knots)</Label>
              <Input
                id="speed"
                type="number"
                step="0.1"
                value={formData.speed}
                onChange={(e) =>
                  setFormData({ ...formData, speed: e.target.value })
                }
                placeholder="455"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Range */}
            <div>
              <Label htmlFor="range">Range (NM)</Label>
              <Input
                id="range"
                type="number"
                step="0.1"
                value={formData.range}
                onChange={(e) =>
                  setFormData({ ...formData, range: e.target.value })
                }
                placeholder="2935"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Ceiling */}
            <div>
              <Label htmlFor="ceiling">Service Ceiling (ft)</Label>
              <Input
                id="ceiling"
                type="number"
                step="1"
                value={formData.ceiling}
                onChange={(e) =>
                  setFormData({ ...formData, ceiling: e.target.value })
                }
                placeholder="41000"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Weight */}
            <div>
              <Label htmlFor="weight">Max Takeoff Weight (tons)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="79.0"
                disabled={loading}
                className="mt-1"
              />
            </div>

            {/* Rarity Score */}
            <div>
              <Label htmlFor="rarity_score">Rarity Score</Label>
              <Input
                id="rarity_score"
                type="number"
                step="0.01"
                value={formData.rarity_score}
                onChange={(e) =>
                  setFormData({ ...formData, rarity_score: e.target.value })
                }
                placeholder="1.5"
                disabled={loading}
                className="mt-1"
              />
            </div>
          </div>

          {/* Auto-catch checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoCatch"
              checked={formData.autoCatch}
              onChange={(e) =>
                setFormData({ ...formData, autoCatch: e.target.checked })
              }
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <Label htmlFor="autoCatch" className="cursor-pointer">
              Automatically mark as caught (add to my collection)
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Aircraft"}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Your custom aircraft has been created successfully.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

