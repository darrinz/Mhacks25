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
    agenda: any;
    description: string;
    isOwner: boolean;
    isReady: boolean;
}

export default function MeetingsPage() {
    const router = useRouter();
    const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);



	useEffect(() => {
		let mounted = true;

		async function loadAllMeetings() {
			try {
				const res = await fetch("/api/meetings");
				if (!res.ok) return; // keep empty array on failure
				const body = await res.json();
				if (!body?.meetings || !Array.isArray(body.meetings)) return;
				
				// map all meetings from API response to Meeting component props
				const mappedMeetings = body.meetings.map((m: any) => ({
					id: m.id ?? "unknown",
					name: m.title ?? "Untitled Meeting",
					datetime: m.datetime ?? m.date ?? new Date().toISOString(),
					description: m.description ?? "",
                    agenda: m.agenda,
					isOwner: !!m.isOwner,
					isReady: !!m.isReady,
				}));
				
				if (mounted) setMeetingsData(mappedMeetings);
			} catch (err) {
				// silently keep empty array on error
				console.warn("Failed to load meetings:", err);
			}
		}

		loadAllMeetings();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h5">All Meetings</Typography>
				<div>
					<Button variant="contained" onClick={() => router.push('/meetings/create')}>Create</Button>
				</div>
			</Stack>

			<Box sx={{ width: '100%', py: 2 }}>
				<Stack direction="column" spacing={2}>
					{meetingsData.map((meeting) => (
						<Box key={meeting.id}>
							<Meeting 
                                id={meeting.id}
								title={meeting.name}
								datetime={meeting.datetime}
								description={meeting.description}
                                agenda={meeting.agenda}
								isOwner={meeting.isOwner} // Keep isOwner for Meeting component
								isReady={meeting.isReady}
								onClickCard={() => router.push(`/meetings/${meeting.id}?type=view`)}
								onView={() => router.push(`/meetings/${meeting.id}`)}
							/>
						</Box>
					))}
				</Stack>
			</Box>
		</Container>
	);
}