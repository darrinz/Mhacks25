"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type MeetingSummaryProps = {
	meetingId: string;
};

export default function MeetingSummary({ meetingId }: MeetingSummaryProps) {
	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Box sx={{ textAlign: 'center' }}>
				<Typography variant="h4" sx={{ mb: 2 }}>
					Meeting Summary
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Summary view for meeting {meetingId} - Coming soon!
				</Typography>
			</Box>
		</Container>
	);
}