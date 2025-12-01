"use client";

import { useEffect, useState } from "react";

export function EnvCheck() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if Supabase env vars are available
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || url === 'https://placeholder.supabase.co' || key === 'placeholder-key') {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg z-50">
      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
        Configuration Warning
      </p>
      <p className="text-xs text-yellow-700 dark:text-yellow-300">
        Supabase environment variables may not be configured correctly. Please check your Netlify environment variables.
      </p>
    </div>
  );
}

