"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

type MeetingPayload = {
  title: string;
  datetime: string;
  description: string;
  preTasks: string[];
  attendees: string[];
};

export default function MeetingForm() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [datetime, setDatetime] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [newPreTask, setNewPreTask] = React.useState("");
  const [preTasks, setPreTasks] = React.useState<string[]>([]);

  const [attendeeInput, setAttendeeInput] = React.useState("");
  const [attendees, setAttendees] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState(false);

  function addPreTask() {
    const v = newPreTask.trim();
    if (!v) return;
    setPreTasks((arr) => [...arr, v]);
    setNewPreTask("");
  }

  function removePreTask(idx: number) {
    setPreTasks((arr) => arr.filter((_, i) => i !== idx));
  }

  function addAttendee() {
    const pieces = attendeeInput
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!pieces.length) return;
    setAttendees((prev) => {
      const set = new Set(prev);
      pieces.forEach((p) => set.add(p));
      return Array.from(set);
    });
    setAttendeeInput("");
  }

  function removeAttendee(value: string) {
    setAttendees((arr) => arr.filter((a) => a !== value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: MeetingPayload = {
      title,
      datetime,
      description,
      preTasks,
      attendees,
    };
    setLoading(true);
    fetch("/api/meetings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Failed to create meeting");
        }
        const data = await res.json();
        // Navigate to meetings list or the newly created meeting page
        router.push("/meetings");
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        alert(err.message || "Error creating meeting");
      });
  }

  function handleReset() {
    setTitle("");
    setDatetime("");
    setDescription("");
    setNewPreTask("");
    setPreTasks([]);
    setAttendeeInput("");
    setAttendees([]);
  }

  const canSubmit =
    !!title.trim() &&
    !!datetime &&
    attendees.length

  return (
    <Card sx={{ maxWidth: 960, mx: "auto", my: 3, borderRadius: 3 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Header row: Title + When */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
            sx={{ mb: 2 }}
          >
            <TextField
              fullWidth
              label="Title"
              placeholder="e.g., Weekly Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="When"
              InputLabelProps={{ shrink: true }}
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EventNoteRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Description (shown to attendees)"
            placeholder="Brief purpose and what success looks like"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Attendee pre-tasks toggle + add field */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="subtitle1">Attendee pre-tasks</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TextField
              fullWidth
              label="Add a pre-task"
              placeholder="e.g., Share stance on Topic A; Post status of Workstream B"
              value={newPreTask}
              onChange={(e) => setNewPreTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPreTask();
                }
              }}
            />
            <Tooltip title="Add pre-task">
              <span>
                <IconButton
                  color="primary"
                  disabled={!newPreTask.trim()}
                  onClick={addPreTask}
                  size="large"
                >
                  <AddRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {preTasks.length > 0 && (
            <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
              {preTasks.map((t, i) => (
                <Stack
                  key={`${t}-${i}`}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <TextField
                    fullWidth
                    value={t}
                    onChange={(e) =>
                      setPreTasks((arr) =>
                        arr.map((v, idx) => (idx === i ? e.target.value : v))
                      )
                    }
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      onClick={() => removePreTask(i)}
                      size="small"
                      color="inherit"
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          )}

          {/* Attendees input + add */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="subtitle1">Attendees</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TextField
              fullWidth
              label="Add attendee"
              placeholder="name or email"
              value={attendeeInput}
              onChange={(e) => setAttendeeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAttendee();
                }
              }}
            />
            <Tooltip title="Add attendee">
              <span>
                <IconButton
                  color="primary"
                  disabled={!attendeeInput.trim()}
                  onClick={addAttendee}
                  size="large"
                >
                  <AddRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {attendees.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              {attendees.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  onDelete={() => removeAttendee(a)}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />


            <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !canSubmit}
              >
                {loading ? "Creating…" : "Create"}
              </Button>
            </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
