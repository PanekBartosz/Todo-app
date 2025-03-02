"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const { isLoading } = useAuth();

  // Wyświetlanie ekranu ładowania podczas sprawdzania stanu uwierzytelniania
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
