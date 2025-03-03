"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          router.push("/"); // Przekieruj do strony głównej po udanym logowaniu
        }
      } catch (error) {
        console.error("Error during auth callback:", error);
        router.push("/auth"); // W przypadku błędu przekieruj z powrotem do strony logowania
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
    </div>
  );
}
