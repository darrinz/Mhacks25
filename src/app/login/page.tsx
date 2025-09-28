"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
	const [name, setName] = useState("");
	const router = useRouter();

	const signIn = (e: React.FormEvent) => {
		e.preventDefault();
		// simple client-side sign in
		localStorage.setItem("signedIn", "true");
		localStorage.setItem("userName", name || "User");
		router.push("/");
	};

	return (
		<Container maxWidth="sm" style={{ padding: "3rem 1rem" }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Sign in
			</Typography>
			<form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
				<TextField
					label="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<div style={{ display: "flex", gap: 12 }}>
					<Button type="submit" variant="contained" color="primary">Sign in</Button>
					<Button variant="outlined" onClick={() => router.push("/")}>Cancel</Button>
				</div>
			</form>
		</Container>
	);
}
