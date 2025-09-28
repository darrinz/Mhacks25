"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";

type MeetingSummaryProps = {
	meetingId: string;
};

// Example markdown content
const exampleMarkdown = `# Meeting Summary

## Meeting Details
- **Date**: January 15, 2025
- **Duration**: 60 minutes
- **Attendees**: John Doe, Jane Smith, Mike Johnson

## Agenda Items

### 1. Project Status Update
The project is currently **on track** for the Q1 deadline. Key accomplishments this week:
- Completed user authentication system
- Finished database schema design
- Started frontend component development

### 2. Technical Decisions
We discussed several technical approaches:

#### Frontend Framework
- React with TypeScript ✅
- Material-UI for components ✅
- Next.js for SSR capabilities ✅

#### Backend Architecture
- Supabase for authentication and database
- Serverless functions for API endpoints

### 3. Action Items
1. **John**: Complete user profile page by January 20
2. **Jane**: Set up CI/CD pipeline by January 18
3. **Mike**: Review database schema and provide feedback

## Challenges Discussed
- **Performance concerns**: Need to optimize initial page load
- **Mobile responsiveness**: Ensure all components work on mobile devices
- **Testing strategy**: Implement comprehensive test coverage

## Next Steps
- Schedule follow-up meeting for January 22
- Begin user testing phase next week
- Prepare demo for stakeholder presentation

---
*Meeting notes recorded by AI Assistant*`;

export default function MeetingSummary({ meetingId }: MeetingSummaryProps) {
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
				<ReactMarkdown>{exampleMarkdown}</ReactMarkdown>
			</Box>
		</Container>
	);
}