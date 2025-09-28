"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter, useParams } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MeetingView from "@/components/MeetingView";
import MeetingForm from "@/components/MeetingForm";
import MeetingSummary from "@/components/MeetingSummary";

export default function MeetingDetailPage() {
	const router = useRouter();
	const params = useParams();
	const meetingId = params.id as string;

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

	// Mock meeting data with questions - in a real app, you'd fetch this based on the ID
	const mockMeetings = {
		"1": {
			name: "Weekly Sync",
			datetime: new Date().toISOString(),
			description: "Team sync to review progress and blockers. This is a detailed description of what we'll cover in this meeting.",
			hasPendingTasks: false,
			questions: [
				{
					id: "progress",
					question: "What progress did you make this week?"
				},
				{
					id: "blockers",
					question: "What blockers are you currently facing?"
				},
				{
					id: "help_needed",
					question: "Do you need help with anything?"
				}
			]
		},
		"2": {
			name: "Design Review",
			datetime: new Date().toISOString(),
			description: "Review new designs for the onboarding flow. We'll go through the wireframes, discuss user feedback, and finalize the approach.",
			hasPendingTasks: true,
			questions: [
				{
					id: "design_feedback",
					question: "What are your thoughts on the new designs?"
				},
				{
					id: "user_concerns",
					question: "Which areas need more attention?"
				},
				{
					id: "approval_status",
					question: "Do you approve the current design direction?"
				}
			]
		},
		"3": {
			name: "Project Kickoff",
			datetime: new Date().toISOString(),
			description: "Introduce the new project and align on milestones. Setting expectations and timeline for the upcoming quarter.",
			hasPendingTasks: false,
			questions: [
				{
					id: "role_understanding",
					question: "Describe your understanding of your role in this project"
				},
				{
					id: "timeline_concerns",
					question: "Do you have any concerns about the proposed timeline?"
				},
				{
					id: "resources_needed",
					question: "What resources or support do you need to be successful?"
				}
			]
		},
		"4": {
			name: "One-on-one",
			datetime: new Date().toISOString(),
			description: "Quarterly check-in to discuss career goals, feedback, and professional development opportunities.",
			hasPendingTasks: false,
			questions: [
				{
					id: "career_goals",
					question: "What are your career goals for the next quarter?"
				},
				{
					id: "satisfaction",
					question: "How satisfied are you with your current role?"
				},
				{
					id: "development_areas",
					question: "Which areas would you like to develop?"
				},
				{
					id: "feedback",
					question: "Any feedback for your manager or the team?"
				}
			]
		},
	};

	const meeting = mockMeetings[meetingId as keyof typeof mockMeetings];

	if (!meeting || !meetingState) {
		return (
			<Container maxWidth="lg" sx={{ py: 3 }}>
				<Typography variant="h5" color="error">
					Meeting not found
				</Typography>
				<Button
					startIcon={<ArrowBackRoundedIcon />}
					onClick={() => router.push('/meetings')}
					sx={{ mt: 2 }}
				>
					Back to Meetings
				</Button>
			</Container>
		);
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