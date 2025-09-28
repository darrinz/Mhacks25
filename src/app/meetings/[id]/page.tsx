import React from "react";
import MeetingView from "@/components/MeetingView";
import MeetingForm from "@/components/MeetingForm";
import MeetingSummary from "@/components/MeetingSummary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type DatabaseMeeting = {
	id: number;
	date: string;
	title: string;
	description: string | null;
	owner: string | null;
	pretasks: any;
	attendees: any;
};

export default async function MeetingDetailPage({ params }: { params: { id: string } }) {
	const meetingId = params.id;
	
	// Fetch meeting from database
	const supabase = await createClient();
	
	const { data: meetingData, error } = await supabase
		.from('meetings')
		.select('*')
		.eq('id', parseInt(meetingId))
		.single();
	
	if (error || !meetingData) {
		console.error('Error fetching meeting:', error);
		redirect('/meetings');
	}

	// Meeting state data - this should match the data from meetings/page.tsx
	const meetingsStateData = [
		{
			id: 1,
			hasPendingTasks: false,
			isEdit: false,
			isReady: false
		},
		{
			id: 2,
			hasPendingTasks: true,
			isEdit: false,
			isReady: false
		},
		{
			id: 3,
			hasPendingTasks: false,
			isEdit: true,
			isReady: false
		},
		{
			id: 4,
			hasPendingTasks: false,
			isEdit: false,
			isReady: true
		}
	];

	const meetingState = meetingsStateData.find(m => m.id === parseInt(meetingId));

	// Transform database response to Meeting object format
	const meeting = {
		name: meetingData.title,
		// normalize DB `date` (timestamptz) to `datetime` for UI components
		datetime: meetingData.date,
		description: meetingData.description || "",
		hasPendingTasks: meetingState?.hasPendingTasks || false,
		questions: Array.isArray(meetingData.pretasks)
			? meetingData.pretasks.map((task: string, index: number) => ({
				id: `task_${index}`,
				question: task
			}))
			: []
	};

	if (!meetingState) {
		redirect('/meetings');
	}

	// Conditional rendering based on state
	// If isEdit is true, render MeetingForm
	if (meetingState.isEdit) {
		return <MeetingForm />;
	}

	// If isReady is true, render MeetingSummary
	if (meetingState.isReady) {
		return <MeetingSummary meetingId={meetingId} />;
	}

	// If isPending is true or everything is false, render MeetingView (default)
	return <MeetingView meeting={meeting} meetingId={meetingId} />;
}