import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/meeting/summary?meetingId=123
 * Returns the markdown summary for a meeting.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const meetingId = url.searchParams.get("meetingId");

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("meetings")
      .select("markdown")
      .eq("id", parseInt(meetingId))
      .maybeSingle();

    if (error) {
      console.error("Error fetching meeting markdown:", error);
      return NextResponse.json({ error: "Failed to load meeting summary" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ markdown: data.markdown ?? "" }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/meeting/summary error", err?.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
