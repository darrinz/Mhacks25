// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value; // Access cookies after resolving the promise.
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // Handle cookie setting here.
          cookieStore.set(name, value, options); // Ensure cookieStore supports .set()
        } catch (error) {
          console.error("Error setting cookie:", error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          // Handle cookie removal here.
          cookieStore.set(name, "", { ...options, maxAge: 0 }); // Ensure cookieStore supports .set()
        } catch (error) {
          console.error("Error removing cookie:", error);
        }
      },
    },
  });
}
