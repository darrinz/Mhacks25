"use client";

import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { createBrowserClient } from "@supabase/ssr";

type Question = {
	id: string;
	question: string;
};

type QuestionsAndAnswers = {
	question: string;
	response: string;
};

type StandardizerPayload = {
	user: string;
	meeting: string;
	questions: QuestionsAndAnswers[];
};

type Meeting = {
	name: string;
	datetime: string;
	description: string;
	hasPendingTasks: boolean;
	questions: Question[];
};

type MeetingViewProps = {
	meeting: Meeting;
	meetingId: string;
};

export default function MeetingView({ meeting, meetingId }: MeetingViewProps) {
	const router = useRouter();
	const [responses, setResponses] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(false);

	const handleResponseChange = (questionId: string, value: any) => {
		setResponses(prev => ({
			...prev,
			[questionId]: value
		}));
	};

	const handleSubmit = async () => {
		setLoading(true);
		
		try {
			// Get current user email from Supabase
			const supabase = createBrowserClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
			);

			const { data: { user }, error } = await supabase.auth.getUser();
			
			if (error || !user?.email) {
				throw new Error("User not authenticated or email not available");
			}

			// Transform responses to match the required schema
			const questionsAndAnswers: QuestionsAndAnswers[] = meeting.questions.map(question => ({
				question: question.question,
				response: responses[question.id] || ""
			}));

			// Create standardizer payload
			const payload: StandardizerPayload = {
				user: user.email,
				meeting: meetingId,
				questions: questionsAndAnswers
			};
			console.log(JSON.stringify(payload));

			// Send POST request to standardizer endpoint
			const response = await fetch("http://127.0.0.1:8002/api/standardize/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log("Standardizer response:", result);
			
			// TODO: Handle successful response (e.g., show success message, redirect)
			
		} catch (error) {
			console.error("Error submitting responses:", error);
			// TODO: Show error message to user
		} finally {
			setLoading(false);
		}
	};

	const dateObj = new Date(meeting.datetime);
	const timeStr = new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(dateObj);

	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
				<Button
					startIcon={<ArrowBackRoundedIcon />}
					onClick={() => router.push('/meetings')}
					variant="outlined"
					size="small"
				>
					Back
				</Button>
				<Typography variant="h4" sx={{ flex: 1 }}>
					{meeting.name}
				</Typography>
				<Button
					startIcon={<EditRoundedIcon />}
					variant="contained"
					size="small"
				>
					Edit
				</Button>
			</Stack>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Stack spacing={3}>
						<Box>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
								<ScheduleRoundedIcon color="action" />
								<Typography variant="h6" color="text.secondary">
									{timeStr}
								</Typography>
							</Stack>
							{meeting.hasPendingTasks && (
								<Chip
									color="warning"
									icon={<AssignmentLateRoundedIcon />}
									label="Has pending tasks"
									sx={{ mt: 1 }}
								/>
							)}
						</Box>

						<Box>
							<Typography variant="h6" sx={{ mb: 1 }}>
								Description
							</Typography>
							<Typography variant="body1" color="text.secondary">
								{meeting.description}
							</Typography>
						</Box>

						<Box>
							<Typography variant="h6" sx={{ mb: 2 }}>
								Questions
							</Typography>
							<Stack spacing={3}>
								{meeting.questions.map((question) => (
									<Card key={question.id} variant="outlined">
										<CardContent>
											<Typography variant="h6" sx={{ mb: 2 }}>
												{question.question}
											</Typography>
											<TextField
												multiline
												rows={4}
												fullWidth
												value={responses[question.id] || ""}
												onChange={(e) => handleResponseChange(question.id, e.target.value)}
												variant="outlined"
												placeholder="Enter your response..."
											/>
										</CardContent>
									</Card>
								))}
							</Stack>
						</Box>

						<Button 
							variant="contained" 
							size="large" 
							fullWidth
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? "Submitting..." : "Submit Responses"}
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
}