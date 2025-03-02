"use client";

import Auth from "@/components/Auth";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return <Auth initialIsLogin={true} />;
}
