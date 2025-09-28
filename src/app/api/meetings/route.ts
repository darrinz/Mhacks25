import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Ramabhadra } from "next/font/google";

/**
 * GET /api/meetings
 * Returns all meetings for the authenticated user (both owned and invited).
 * The user's email is read from the Supabase session. Meetings.attendees is a JSONB
 * array of emails/names; we check whether the user's email is contained in that array.
 * Results are sorted by date (most recent first).
 */
export async function GET() {
	try {
	const supabase = await createClient();

	// Get the logged in user (server-side)
	const { data: userData, error: userErr } = await supabase.auth.getUser();
		if (userErr || !userData?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

	const emailRaw = userData.user.email;
	const email = typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : emailRaw;
		if (!email) {
			return NextResponse.json({ error: "No email on user" }, { status: 400 });
		}

		// Query meetings where attendees JSONB array contains the user's email.
		// Also ensure the meeting date (stored as text) is in the future by casting to timestamptz.
		// We order ascending and take the first result.


		// All the user invited emails (all meetings, not just future ones)
		// Skip the JSONB query that's causing issues and go straight to JS filtering
		let invitedMeetings: any[] = [];
		let error: any = null;

		// Helper to normalize attendee entries into an array of emails (strings)
		function extractEmails(attArr: any): string[] {
			if (!Array.isArray(attArr)) return [];
			return attArr
				.map((x: any) => {
					if (!x && x !== 0) return null;
					if (typeof x === 'string') return x.trim().toLowerCase();
					// support stored objects like { email: 'a@b.com', name: 'A' }
					if (typeof x === 'object' && x !== null) {
						const candidate = x.email ?? x.email_address ?? x.user_email ?? x.name ?? null;
						return candidate ? String(candidate).trim().toLowerCase() : null;
					}
					return null;
				})
				.filter(Boolean) as string[];
		}

		// Fetch all candidate meetings and filter locally using JS
		const { data: candidates, error: candErr } = await supabase
			.from('meetings')
			.select('*')
			.order('date', { ascending: false }); // Most recent first

		if (candErr) {
			console.warn('candidate fetch failed:', candErr.message);
			invitedMeetings = [];
		} else {
			invitedMeetings = (candidates || []).filter((m: any) => {
				const emails = extractEmails(m.attendees);
				return emails.includes(email);
			});
		}

		const invited_meetings = (invitedMeetings || []).map((meeting: any) => ({ ...meeting, isOwner: false }));
        // console.log(invitedMeetings)

        // console.log(email)

		const { data: ownedMeetings, error: ownedError } = await supabase
			.from("meetings")
			.select("*")
			.eq('owner', email)
			.order("date", { ascending: false }); // Most recent first

		if (ownedError) {
			console.warn("owned meetings query failed:", ownedError.message);
		}

		const owned_meetings = (ownedMeetings || []).map((meeting: any) => ({ ...meeting, isOwner: true }));

        // console.log("ownerd meetings:")
        // console.log(owned_meetings)



		// Merge invited + owned and sort by the `date` timestamp (most recent first)
		let meetings = [...invited_meetings, ...owned_meetings].sort((a: any, b: any) =>
			(new Date(b.date ?? b.datetime).getTime() || 0) - (new Date(a.date ?? a.datetime).getTime() || 0)
		);

        // Check for responses for each meeting
        const meetingsWithResponses = await Promise.all(meetings.map(async (meeting) => {
			const { data: responses } = await supabase
				.from("user_meeting_responses")
				.select("*")
				.eq('meeting_id', meeting.id)
				// the schema's column is `email` (not user_email)
				.eq('email', email)
				.single();

			return {
				...meeting,
				// normalize the property clients expect
				datetime: meeting.date ?? meeting.datetime,
				isReady: responses !== null
			};
        }));

        meetings = meetingsWithResponses;
        // All user hosted meetins

		if (!meetings || meetings.length === 0) {
			return NextResponse.json({ meetings: [] }, { status: 200 });
		}

        // console.log("All metings:")
        // console.log(meetings)

        

		return NextResponse.json({ meetings }, { status: 200 });
	} catch (err: any) {
		console.error("GET /api/meetings error", err?.message || err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}