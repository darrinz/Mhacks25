"use client";

import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeetingsPage() {
	const router = useRouter();

	const signOut = () => {
		localStorage.removeItem("signedIn");
		localStorage.removeItem("userName");
		router.push("/");
	};

	return (
		<Container maxWidth="md" style={{ padding: "2.5rem 1rem" }}>
			<Typography variant="h4" gutterBottom>
				Meetings
			</Typography>
			<Typography color="textSecondary" paragraph>
				This is a placeholder meetings page. You can create, view and join meetings from here.
			</Typography>

			<div style={{ display: "flex", gap: 12 }}>
				<Link href="/meetings/create" passHref>
					<Button variant="contained">Create Meeting</Button>
				</Link>
				<Button variant="outlined" onClick={signOut}>Sign out</Button>
			</div>
		</Container>
	);
}