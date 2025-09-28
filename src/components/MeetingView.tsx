// app/components/MeetingView.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { createBrowserClient } from "@supabase/ssr";

/** ---- Types ---- */
type Question = { id: string; question: string };
type QuestionsAndAnswers = { question: string; response: string };
type StandardizerPayload = {
  user: string;
  meeting: string;
  questions: QuestionsAndAnswers[];
};

type MeetingRow = {
  id: number;
  title: string;
  description: string | null;
  datetime?: string | null; // preferred
  date?: string | null;     // legacy
  pretasks?: string[] | null;
};

type Props = {
  meetingId: string;
};

/** ---- Component ---- */
export default function MeetingView({ meetingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [meeting, setMeeting] = useState<{
    name: string;
    datetime: string;
    description: string;
    questions: Question[];
  } | null>(null);

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch meeting from Supabase client-side
  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setLoadError(null);

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Adjust table/columns as per your schema
        const { data, error } = await supabase
          .from("meetings")
          .select("id,title,description,datetime,date,pretasks")
          .eq("id", meetingId)
          .maybeSingle<MeetingRow>();

		  console.log(data)

        if (error) throw error;
        if (!data) throw new Error("Meeting not found");

        const dt = data.datetime || data.date || "";
        const qs =
          Array.isArray(data.pretasks) && data.pretasks.length > 0
            ? data.pretasks.map((q, i) => ({ id: `task_${i}`, question: q }))
            : [];

        const mapped = {
          name: data.title,
          datetime: dt,
          description: data.description ?? "",
          questions: qs,
        };

        if (active) {
          setMeeting(mapped);
          // Initialize response state so all questions exist
          setResponses(
            Object.fromEntries(mapped.questions.map((q) => [q.id, ""]))
          );
        }
      } catch (e: any) {
        console.error(e);
        if (active) setLoadError(e?.message || "Failed to load meeting");
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [meetingId]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const hasPendingTasks = useMemo(
    () =>
      !!meeting?.questions?.length &&
      meeting.questions.some((q) => !(responses[q.id] || "").trim()),
    [meeting, responses]
  );

  const timeStr = useMemo(() => {
    if (!meeting?.datetime) return "";
    const d = new Date(meeting.datetime);
    if (isNaN(d.getTime())) return meeting.datetime; // show raw if invalid
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }, [meeting?.datetime]);

  const handleSubmit = async () => {
    if (!meeting) return;
    setSubmitting(true);
    try {
      // Get user
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user?.email) {
        throw new Error("User not authenticated or email missing");
      }

      const questionsAndAnswers: QuestionsAndAnswers[] = meeting.questions.map(
        (q) => ({
          question: q.question,
          response: responses[q.id] || "",
        })
      );

      const payload: StandardizerPayload = {
        user: user.email,
        meeting: meetingId,
        questions: questionsAndAnswers,
      };

      const resp = await fetch("http://127.0.0.1:8002/api/standardize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const result = await resp.json();
      console.log("Standardizer response:", result);

      // TODO: maybe toast success, then route to summary or back to meeting list
      // router.push(`/meetings/${meetingId}?type=viewAgenda`);
    } catch (e) {
      console.error("Error submitting responses:", e);
      // TODO: surface an error snackbar/toast
    } finally {
      setSubmitting(false);
    }
  };

  /** ---- Rendering ---- */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width={88} height={36} />
          <Skeleton variant="text" sx={{ flex: 1 }} height={40} />
          <Skeleton variant="rectangular" width={88} height={36} />
        </Stack>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width={240} />
              <Skeleton variant="rectangular" height={48} />
              <Skeleton variant="text" width={"60%"} />
              <Skeleton variant="rectangular" height={120} />
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (loadError || !meeting) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => router.push("/meetings")}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError ?? "Meeting not found."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => router.push("/meetings")}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {meeting.name}
        </Typography>
        <Button startIcon={<EditRoundedIcon />} variant="contained" size="small"
          onClick={() => router.push(`/meetings/${meetingId}?type=edit`)}>
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
                  {timeStr || "—"}
                </Typography>
              </Stack>
              {hasPendingTasks && (
                <Chip
                  color="warning"
                  icon={<AssignmentLateRoundedIcon />}
                  label="Has pending tasks"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            {!!meeting.description && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {meeting.description}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Questions
              </Typography>
              <Stack spacing={3}>
                {meeting.questions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No pre-tasks for this meeting.
                  </Typography>
                ) : (
                  meeting.questions.map((q) => (
                    <Card key={q.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {q.question}
                        </Typography>
                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          value={responses[q.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(q.id, e.target.value)
                          }
                          variant="outlined"
                          placeholder="Enter your response..."
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </Box>

            {meeting.questions.length > 0 && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Responses"}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
