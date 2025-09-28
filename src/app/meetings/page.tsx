"use client";

import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Meeting from "@/components/Meeting";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
interface Meeting {
    id: string;
    name: string;
    datetime: string;
    description: string;
    isOwner: boolean;
    isReady: boolean;
}

export default function MeetingsPage() {
    const router = useRouter();
    const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);



	useEffect(() => {
		let mounted = true;

		async function loadUpcoming() {
			try {
				const res = await fetch("/api/meetings");
				if (!res.ok) return; // keep mock data on failure
				const body = await res.json();
				if (!body?.meetings) return;
				const m = body.meetings[0];
				// map API meeting shape to Meeting component props
				const mapped = {
					id: m.id ?? "api",
					name: m.title,
					datetime: m.datetime ?? m.date ?? new Date().toISOString(),
					description: m.description ?? "",
					isOwner: !!m.isOwner,
					isReady: false,
				};
				if (mounted) setMeetingsData([mapped]);
			} catch (err) {
				// silently keep mock data on error
				console.warn("Failed to load upcoming meeting:", err);
			}
		}

		loadUpcoming();
		return () => {
			mounted = false;
		};
	}, []);

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
								title={meeting.name}
								datetime={meeting.datetime}
								description={meeting.description}
								isOwner={meeting.isOwner} // Keep isOwner for Meeting component
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