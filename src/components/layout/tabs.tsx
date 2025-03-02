"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Tabs() {
  const pathname = usePathname();

  return (
    <div className="flex space-x-4 mb-6">
      <Link
        href="/dashboard"
        className={cn(
          "px-4 py-2 rounded-lg",
          pathname === "/dashboard"
            ? "bg-red-100 text-red-600"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        Today
      </Link>
      <Link
        href="/dashboard/upcoming"
        className={cn(
          "px-4 py-2 rounded-lg",
          pathname === "/dashboard/upcoming"
            ? "bg-red-100 text-red-600"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        Upcoming
      </Link>
    </div>
  );
}
