import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { title, datetime, description, preTasks, attendees } = body || {};

		if (!title || !datetime || !Array.isArray(attendees) || attendees.length === 0) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
        
		const supabase = await createClient();

		// Get the logged in user (server-side)
		const { data: userData, error: userErr } = await supabase.auth.getUser();

		// Ensure we store an ISO timestamp in the `date` column (Postgres timestamptz)
		const isoDate = (new Date(datetime)).toISOString();

		const insertPayload = {
			title: String(title),
			owner: userData.user?.email,
			date: isoDate,
			description: description ?? null,
			markdown: String(""),
			pretasks: Array.isArray(preTasks) ? preTasks : [],
			attendees: Array.isArray(attendees) ? attendees : [],
		};

		const { data, error } = await supabase.from("meetings").insert(insertPayload).select().single();

		if (error) {
			console.error("error inserting meeting", error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ meeting: data }, { status: 201 });
	} catch (err: any) {
		console.error("POST /api/meetings error", err?.message || err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
