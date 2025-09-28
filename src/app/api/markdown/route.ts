import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { meeting, markdown } = await request.json();

    if (!meeting || !markdown) {
      return NextResponse.json(
        { error: "Missing meeting ID or markdown content" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("meetings")
      .update({ markdown: markdown })
      .eq("id", meeting);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update markdown" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Markdown updated successfully"
    });

  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}