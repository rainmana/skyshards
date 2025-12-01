import { AddAircraftForm } from "@/components/add-aircraft/add-aircraft-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AddAircraftPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Add Custom Aircraft
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create your own custom aircraft that only you can see. Fill in the details below.
        </p>
      </div>

      <AddAircraftForm userId={user.id} />
    </div>
  );
}

