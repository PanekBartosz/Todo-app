import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Create a new supabase server component client with awaited cookies
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error(
        "Brak sesji w dashboard layout, przekierowanie do strony logowania"
      );
      return redirect("/login");
    }

    return <div className="min-h-screen bg-gray-50">{children}</div>;
  } catch (error) {
    console.error("Dashboard Layout Error:", error);
    return redirect("/login");
  }
}
