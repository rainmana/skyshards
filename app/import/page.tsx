import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CSVImportForm } from "@/components/csv-import/csv-import-form";

export const dynamic = 'force-dynamic';

export default async function ImportPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Import Aircraft
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          Upload a CSV file to bulk import aircraft and mark them as caught. This is perfect for importing your existing collection data.
        </p>
      </div>

      <CSVImportForm />
    </div>
  );
}

