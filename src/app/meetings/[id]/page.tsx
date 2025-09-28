import React from "react";
import MeetingView from "@/components/MeetingView";
import MeetingForm from "@/components/MeetingForm";
import MeetingSummary from "@/components/MeetingSummary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type DatabaseMeeting = {
	id: number;
	date: string;
	title: string;
	agenda: any;
	description: string | null;
	owner: string | null;
	pretasks: any;
	attendees: any;
};

export default async function MeetingDetailPage({ 
	params 
}: { 
	params: Promise<{ id?: string }>;
}) {
	const resolvedParams = await params;
	const meetingId = resolvedParams?.id;

	// If no meetingId supplied, redirect to meetings list
	if (!meetingId) {
		redirect('/meetings');
	}
	
	// Fetch meetings from API to get isOwner and isReady properties
	const headersList = await headers();
	
	let meetingData;
	let isOwner = false;
	let isReady = false;

	try {
		// Fetch from our API endpoint which includes isOwner and isReady
		const host = headersList.get('host') || 'localhost:3000';
		const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
		const response = await fetch(`${protocol}://${host}/api/meetings`, {
			headers: {
				Cookie: headersList.get('cookie') || '',
			},
		});

		if (!response.ok) {
			redirect('/meetings');
		}

		const { meetings } = await response.json();
		meetingData = meetings.find((m: any) => m.id === parseInt(meetingId));

		if (!meetingData) {
			redirect('/meetings');
		}

		// Now we have the meeting with isOwner and isReady from the API
		isOwner = meetingData.isOwner;
		isReady = meetingData.isReady;

	} catch (error) {
		console.error('Error fetching meeting data:', error);
		redirect('/meetings');
	}


	// Conditional rendering based on boolean flags
	if (isOwner) {
		return <MeetingForm />;
	}
	
	if (isReady) {
		return <MeetingSummary meetingId={meetingId} />;
	}
	
	// Default: not ready and not owner
	return <MeetingView meetingId={meetingId} />;
}