import React, { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

export default function MeetingForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [attendees, setAttendees] = useState("");
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, datetime, agenda, attendees: attendees.split(/,\s*/), questions };
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit?.(payload);
    }, 600);
  }

  return (
    <Card sx={{ maxWidth: 900, margin: "24px auto", borderRadius: 2 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <div>
              <Typography variant="h6">Pre-meeting information</Typography>
              <Typography color="text.secondary">Collect inputs from attendees so meetings start prepared.</Typography>
            </div>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <TextField fullWidth label="Meeting title" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. Project sync" />
            </Box>

            <Box>
              <TextField fullWidth type="datetime-local" label="When" InputLabelProps={{ shrink: true }} value={datetime} onChange={e => setDatetime(e.target.value)} />
            </Box>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField fullWidth multiline minRows={4} label="Agenda / Goals" value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="What do you want to accomplish?" />
            </Box>

            <Box>
              <TextField fullWidth label="Expected attendees" value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="Comma-separated emails or names" helperText="Separate multiple attendees with commas." />
            </Box>

            <Box>
              <TextField fullWidth multiline minRows={3} label="Pre-meeting questions" value={questions} onChange={e => setQuestions(e.target.value)} placeholder="Any questions or topics participants should prepare" />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}>
            <Button variant="outlined" onClick={() => { setTitle(""); setDatetime(""); setAgenda(""); setAttendees(""); setQuestions(""); }}>
              Reset
            </Button>
            <Button type="submit" variant="contained" disabled={loading || !title}>
              {loading ? "Sending..." : "Send pre-meeting info"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
