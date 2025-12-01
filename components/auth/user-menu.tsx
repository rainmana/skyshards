"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UserMenu() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
        }
        
        setUser(user);
      } catch (err) {
        console.error('Error in getUser:', err);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up auth state listener:', err);
      return () => {};
    }
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={() => router.push("/login")}>
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {user.email?.split("@")[0] || "User"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

