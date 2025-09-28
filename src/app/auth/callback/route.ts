// auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const BaseURL = "http://localhost:3000/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code"); // Extract the authorization code from the query params

  if (code) {
    const supabase = await createClient(); // Await the `createClient` function since it's asynchronous
    const { error } = await supabase.auth.exchangeCodeForSession(code); // Exchange the code for a session

    if (error) {
      return NextResponse.redirect(`${BaseURL}/auth/error`); // Use a safer way to redirect, avoiding `window.location`
    }
  }

  return NextResponse.redirect(`${BaseURL}/meetings`); // Redirect to the homepage
}
