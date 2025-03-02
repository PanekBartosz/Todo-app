"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Sprawdź czy to była próba logowania
        if (searchParams.get("registration") === "false") {
          if (!session) {
            alert("Nie znaleziono konta. Proszę najpierw się zarejestrować.");
            router.replace("/?register=true"); // Przekieruj do strony rejestracji
            return;
          }
        }

        router.replace("/");
      } catch (error: any) {
        console.error("Błąd podczas logowania:", error);
        alert(error.message);
        router.replace("/");
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl">Trwa logowanie...</h2>
        <p className="text-gray-500">Proszę czekać</p>
      </div>
    </div>
  );
}
