"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Meeting from "@/components/Meeting";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function MeetingsPage() {
	const router = useRouter();

	const meetingsData = [
		{
			id: 1,
			name: "Weekly Sync",
			datetime: new Date().toISOString(),
			description: "Team sync to review progress and blockers.",
			hasPendingTasks: false,
			isEdit: false,
			isReady: false
		},
		{
			id: 2,
			name: "Design Review",
			datetime: new Date().toISOString(),
			description: "Review new designs for the onboarding flow.",
			hasPendingTasks: true,
			isEdit: false,
			isReady: false
		},
		{
			id: 3,
			name: "Project Kickoff",
			datetime: new Date().toISOString(),
			description: "Introduce the new project and align on milestones.",
			hasPendingTasks: false,
			isEdit: true,
			isReady: false
		},
		{
			id: 4,
			name: "One-on-one",
			datetime: new Date().toISOString(),
			description: "Quarterly check-in",
			hasPendingTasks: false,
			isEdit: false,
			isReady: true
		}
	];

	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h5">Meetings</Typography>
				<div>
					<Button variant="contained" onClick={() => router.push('/meetings/create')}>Create</Button>
				</div>
			</Stack>

			<Box sx={{ width: '100%', py: 2 }}>
				<Stack direction="column" spacing={2}>
					{meetingsData.map((meeting) => (
						<Box key={meeting.id}>
							<Meeting 
								name={meeting.name}
								datetime={meeting.datetime}
								description={meeting.description}
								hasPendingTasks={meeting.hasPendingTasks}
								isEdit={meeting.isEdit}
								isReady={meeting.isReady}
								onClickCard={() => router.push(`/meetings/${meeting.id}`)}
								onView={() => router.push(`/meetings/${meeting.id}`)}
							/>
						</Box>
					))}
				</Stack>
			</Box>
		</Container>
	);
}