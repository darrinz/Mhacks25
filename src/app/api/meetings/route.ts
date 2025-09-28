import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Ramabhadra } from "next/font/google";

/**
 * GET /api/meetings
 * Returns the next upcoming meeting for the authenticated user.
 * The user's email is read from the Supabase session. Meetings.attendees is a JSONB
 * array of emails/names; we check whether the user's email is contained in that array.
 */
export async function GET(request: Request) {
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
	// Use ISO timestamp for comparisons against a timestamptz `date` column
	const now = new Date().toISOString();


		// All the user invited emails
		let { data: invitedMeetings, error } = await supabase
			.from("meetings")
			.select("*")
			.contains('attendees', [email])
			.gt('date', now)
			.order("date", { ascending: true });

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

		// If the contains query failed or returned nothing, fall back to a JS filter that
		// can handle different shapes (strings or objects) inside the attendees JSONB.
		if (error || !Array.isArray(invitedMeetings) || invitedMeetings.length === 0) {
			if (error) console.warn('invited meetings .contains query failed, falling back to JS filter:', error.message);
			// Fetch candidate meetings (by date) and filter locally
			const { data: candidates, error: candErr } = await supabase
				.from('meetings')
				.select('*')
				.gt('date', now)
				.order('date', { ascending: true });

			if (candErr) {
				console.warn('fallback candidate fetch failed:', candErr.message);
				invitedMeetings = [];
			} else {
				invitedMeetings = (candidates || []).filter((m: any) => {
					const emails = extractEmails(m.attendees);
					return emails.includes(email);
				});
			}
		}

		const invited_meetings = (invitedMeetings || []).map((meeting: any) => ({ ...meeting, isOwner: false }));
        console.log(invitedMeetings)

        console.log(email)

		const { data: ownedMeetings, error: ownedError } = await supabase
			.from("meetings")
			.select("*")
			.eq('owner', email)
			.gt('date', now)
			.order("date", { ascending: true });

		if (ownedError) {
			console.warn("owned meetings query failed:", ownedError.message);
		}

		const owned_meetings = (ownedMeetings || []).map((meeting: any) => ({ ...meeting, isOwner: true }));

        console.log("ownerd meetings:")
        console.log(owned_meetings)



		// Merge invited + owned and sort by parsed date safely (fall back to 0 if unparsable)
		// Merge invited + owned and sort by the `date` timestamp
		let meetings = [...invited_meetings, ...owned_meetings].sort((a: any, b: any) =>
			(new Date(a.date ?? a.datetime).getTime() || 0) - (new Date(b.date ?? b.datetime).getTime() || 0)
		);

        // Check for responses for each meeting
        const meetingsWithResponses = await Promise.all(meetings.map(async (meeting) => {
			const { data: responses, error: responseError } = await supabase
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

		if (!meetings) {
			return NextResponse.json({ error: "No upcoming meetings" }, { status: 404 });
		}

        console.log("All metings:")
        console.log(meetings)

        

		return NextResponse.json({ meetings }, { status: 200 });
	} catch (err: any) {
		console.error("GET /api/meetings error", err?.message || err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}