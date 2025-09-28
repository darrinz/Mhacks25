// app/page.tsx
import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Navbar from "@/components/Navbar";
import appTheme from "@/theme";

export default function Page() {
  const theme = appTheme;

  return (
    <>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Chip
                label="New • Pre-tasked meetings that end on time"
                color="secondary"
                variant="outlined"
                sx={{ mb: 2, borderRadius: 999 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "text.primary",
                  mb: 2,
                }}
              >
                Meetings that decide, not drift.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
                Smoothie collects inputs <em>before</em> the meeting, auto-prioritizes
                the agenda for what everyone needs, and clearly signals when some
                attendees are free to leave.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/meetings"
                  variant="contained"
                  size="large"
                  endIcon={<KeyboardArrowRightRoundedIcon />}
                >
                  Get started free
                </Button>
                <Button
                  component={Link}
                  href="/meetings"
                  variant="text"
                  size="large"
                >
                  See it in action
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
                <CheckCircleRoundedIcon fontSize="small" color="success" />
                <Typography variant="body2" color="text.secondary">
                  No credit card • SSO ready • SOC2 on roadmap
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '45%' } }}>
              {/* Visual placeholder: product mock card */}
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 1,
                    px: 2,
                    fontWeight: 600,
                  }}
                >
                  Auto-generated Agenda
                </Box>
                <CardContent>
                  <Stack spacing={1.5}>
                    {[
                      { title: "All-hands items", meta: "10 mins • all attendees" },
                      { title: "Platform risks", meta: "8 mins • Eng, PM" },
                      { title: "Design decisions", meta: "12 mins • PM, Design" },
                      { title: "Marketing sync", meta: "6 mins • GTM" },
                    ].map((it, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {it.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {it.meta}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    Tip: You’ll be notified when your segment ends — feel free to leave.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Trust bar */}
      <Box component="section" sx={{ py: 3, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems="center"
          >
            {["Fast-moving product teams", "Client services", "Ops & PMOs"].map((label) => (
              <Typography
                key={label}
                variant="body2"
                sx={{ color: "text.secondary", opacity: 0.9 }}
              >
                {label}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Value props */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            <ValueCard
              icon={<AccessTimeRoundedIcon />}
              title="Shorter, sharper meetings"
              text="Collect stances, updates, and questions up-front. Smoothie builds a focused agenda and timeboxes each item."
            />
            <ValueCard
              icon={<AssignmentTurnedInRoundedIcon />}
              title="Pre-tasks that matter"
              text="Ask attendees for simple text answers tied to the meeting context. No fluff — just what you need to decide."
            />
            <ValueCard
              icon={<Groups2RoundedIcon />}
              title="Relevance-based exits"
              text="Clearly mark when a group’s relevance ends so they can leave guilt-free — and reclaim their time."
            />
            <ValueCard
              icon={<TimelineRoundedIcon />}
              title="Seniority-blind agendas"
              text="Important info rises to the top based on relevance, not title. Interns included."
            />
            <ValueCard
              icon={<ShieldRoundedIcon />}
              title="Enterprise ready"
              text="SSO, role-based access, and data residency options. Built for teams from 10 to 10,000."
            />
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: "background.default",
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 3 }}>
            How Smoothie works
          </Typography>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
            <StepCard
              step="1"
              title="Create meeting & pre-tasks"
              text="Define the goal, set time, and ask for inputs (stance, status, questions) tailored to the agenda."
            />
            <StepCard
              step="2"
              title="Collect & prioritize"
              text="We cluster responses and prioritize agenda items by impact and shared relevance."
            />
            <StepCard
              step="3"
              title="Run the meeting"
              text="Follow the generated agenda, timebox each item, and let irrelevant groups drop off early."
            />
            <StepCard
              step="4"
              title="Auto-digest & follow-ups"
              text="Everyone gets outcomes, owners, and due dates. No ‘what did we decide?’ messages after."
            />
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Card
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              textAlign: "center",
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              End the “this could’ve been an email” era.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Put pre-tasks to work and run meetings that make decisions — fast.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button component={Link} href="/signup" variant="contained" size="large">
                Create your first meeting
              </Button>
              <Button component={Link} href="/demo" variant="text" size="large">
                Watch a 2-min demo
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              © {new Date().getFullYear()} Smoothie
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography component={Link} href="/privacy" color="text.secondary">
                Privacy
              </Typography>
              <Typography component={Link} href="/terms" color="text.secondary">
                Terms
              </Typography>
              <Typography component={Link} href="/security" color="text.secondary">
                Security
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

/** --- Helpers --- */

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 2,
          border: `1px solid ${appTheme.palette.divider}`,
          borderRadius: 2,
          height: "100%",
        }}
      >
        <Box sx={{ mt: 0.25 }}>{icon}</Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <Box>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          border: `1px solid ${appTheme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Chip
            label={`Step ${step}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, borderRadius: 999 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
