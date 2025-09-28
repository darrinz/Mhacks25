import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { user, meeting, responses } = body || {};

		if (!user || !meeting || !Array.isArray(responses)) {
			return NextResponse.json({ error: "Missing required fields: user, meeting, and responses array" }, { status: 400 });
		}

		const supabase = await createClient();

		// Transform responses array into jsonb format
		const responsesObject = responses.reduce((acc, item) => {
			if (item.question && item.response !== undefined) {
				acc[item.question] = item.response;
			}
			return acc;
		}, {});

		const insertPayload = {
			email: user,
			meeting_id: meeting,
			responses: responsesObject,
			prompt: {}
		};

		const { data, error } = await supabase
			.from("user_meeting_responses")
			.upsert(insertPayload, { 
				onConflict: 'meeting_id,email'
			})
			.select()
			.single();

		if (error) {
			console.error("Error inserting user meeting response:", error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ data }, { status: 201 });
	} catch (err: any) {
		console.error("POST /api/poststandard error:", err?.message || err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}