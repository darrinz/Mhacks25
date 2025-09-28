// utils/supabase/user.ts
import { createClient } from "@/utils/supabase/server"; // Import the createClient function

export async function getAuthenticatedUser() {
  // Initialize the Supabase client
  const supabase = await createClient();

  // Get the authenticated user's session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Throw an error if the user is not authenticated
  if (!user) {
    throw new Error("Not authenticated");
  }

  // Return the authenticated user
  return user;
}
