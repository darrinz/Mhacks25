"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Meeting from "@/components/Meeting";
// inline responsive wrapping; removed MeetingsGrid
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function MeetingsPage() {
	const router = useRouter();

	const signOut = () => {
		localStorage.removeItem("signedIn");
		localStorage.removeItem("userName");
		router.push("/");
	};

	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h5">Meetings</Typography>
				<div>
					<Button variant="contained" onClick={() => router.push('/meetings/create')}>Create</Button>
					<Button sx={{ ml: 1 }} variant="outlined" onClick={signOut}>Sign out</Button>
				</div>
			</Stack>

			<Box sx={{ width: '100%', py: 2 }}>
				<Stack direction="column" spacing={2}>
					<Box>
						<Meeting name="Weekly Sync" datetime={new Date().toISOString()} description="Team sync to review progress and blockers." />
					</Box>
					<Box>
						<Meeting name="Design Review" datetime={new Date().toISOString()} description="Review new designs for the onboarding flow." hasPendingTasks />
					</Box>
					<Box>
						<Meeting name="Project Kickoff" datetime={new Date().toISOString()} description="Introduce the new project and align on milestones." />
					</Box>
					<Box>
						<Meeting name="One-on-one" datetime={new Date().toISOString()} description="Quarterly check-in" />
					</Box>
				</Stack>
			</Box>
		</Container>
	);
}