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
	description: string | null;
	owner: string | null;
	pretasks: any;
	attendees: any;
};

export default async function MeetingDetailPage({ params }: { params?: { id?: string } }) {
	const meetingId = params?.id;

	// If no meetingId supplied, redirect to meetings list
	if (!meetingId) {
		redirect('/meetings');
	}
	
	// Fetch meetings from API to get isOwner and isReady properties
	const headersList = await headers();
	const host = headersList.get('host') || 'localhost:3000';
	const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
	
	let meetingData;
	let isOwner = false;
	let isReady = false;

	try {
		// Fetch from our API endpoint which includes isOwner and isReady
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

	// Transform database response to Meeting object format
	const meeting = {
		name: meetingData.title,
		// normalize DB `date` (timestamptz) to `datetime` for UI components
		datetime: meetingData.datetime || meetingData.date,
		description: meetingData.description || "",
		hasPendingTasks: !isReady, // If not ready, they have pending tasks
		questions: Array.isArray(meetingData.pretasks)
			? meetingData.pretasks.map((task: string, index: number) => ({
				id: `task_${index}`,
				question: task
			}))
			: []
	};

	// Conditional rendering based on API data
	// If isOwner is true, render MeetingForm
	if (isOwner) {
		return <MeetingForm />;
	}

	// If isReady is true, render MeetingSummary
	if (isReady) {
		return <MeetingSummary meetingId={meetingId} />;
	}

	// If not ready, render MeetingView (default) for pending tasks
	return <MeetingView meeting={meeting} meetingId={meetingId} />;
}