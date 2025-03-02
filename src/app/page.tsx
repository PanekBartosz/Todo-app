"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Todo from "@/components/Todo";
import Logo from "@/components/Logo";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (user) {
    return <Todo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <button
            onClick={() => router.push("/auth")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Log in
          </button>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-center mb-8 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl max-w-4xl">
            Organize your work and life
          </h1>
          <p className="text-center mb-12 max-w-2xl text-lg text-gray-600">
            Become focused, organized, and calm with TaskFlow. The world's most
            popular task management app.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="rounded-lg bg-red-600 px-8 py-4 text-lg font-medium text-white shadow-sm hover:bg-red-700"
          >
            START NOW
          </button>
        </div>

        {/* Features */}
        <div className="grid gap-8 py-8 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="rounded-xl bg-white p-6 shadow-sm text-center">
            <div className="mb-4 inline-block rounded-lg bg-red-100 p-3">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Clear your mind</h3>
            <p className="text-gray-600">
              The fastest way to get tasks out of your head and organized.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm text-center">
            <div className="mb-4 inline-block rounded-lg bg-red-100 p-3">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Focus on what matters
            </h3>
            <p className="text-gray-600">
              Stay on top of your tasks and organize your work efficiently.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm text-center">
            <div className="mb-4 inline-block rounded-lg bg-red-100 p-3">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Boost productivity</h3>
            <p className="text-gray-600">
              Track your progress and celebrate your achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
