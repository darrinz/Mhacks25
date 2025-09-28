"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Sign out the user using Supabase client, clear local auth flags, and optionally redirect.
 * @param redirectTo Optional path to navigate to after sign-out. Defaults to '/'.
 */
export default async function signOutUser(redirectTo = "/") {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signOut();

    // Clear client-side flag(s)
    try {
      localStorage.removeItem("signedIn");
    } catch (e) {
      // ignore
    }

    // Perform client-side navigation/redirect
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  } catch (err) {
    console.error("Error signing out:", err);
    // still attempt to clear local flag and redirect
    try { localStorage.removeItem("signedIn"); } catch {}
    if (typeof window !== "undefined") window.location.href = redirectTo;
  }
}
