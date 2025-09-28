"use client";

import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";

type MeetingSummaryProps = {
	meetingId: string;
};


export default function MeetingSummary({ meetingId }: MeetingSummaryProps) {
	const [markdown, setMarkdown] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		async function fetchMarkdown() {
			try {
				setLoading(true);
				const res = await fetch(`/api/meeting/summary?meetingId=${encodeURIComponent(meetingId)}`);
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					setError(body?.error || "Failed to load meeting summary");
					return;
				}
				const body = await res.json();
				if (!mounted) return;
				setMarkdown(body.markdown || "No summary available for this meeting.");
			} catch (err) {
				if (!mounted) return;
				setError("An unexpected error occurred");
				console.error("Unexpected error:", err);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		if (meetingId) {
			fetchMarkdown();
		}

		return () => {
			mounted = false;
		};
	}, [meetingId]);

	return (
		<Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', px: 1 }}>
			<Box sx={{ py: 2 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Meeting Summary
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" gutterBottom>
					Meeting ID: {meetingId}
				</Typography>
			</Box>
			<Box sx={{ 
				flex: 1, 
				fontSize: '1.2rem',
				padding: '16px',
				'& h1': { fontSize: '2.5rem' },
				'& h2': { fontSize: '2rem' },
				'& h3': { fontSize: '1.5rem' },
				'& h4': { fontSize: '1.3rem' },
				'& p, & li': { fontSize: '1.2rem', lineHeight: 1.6 }
			}}>
				{loading && (
					<Typography>Loading meeting summary...</Typography>
				)}
				{error && (
					<Typography color="error">{error}</Typography>
				)}
				{!loading && !error && (
					<ReactMarkdown>{markdown}</ReactMarkdown>
				)}
			</Box>
		</Container>
	);
}