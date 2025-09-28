// app/components/Meeting.tsx
"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type MeetingProps = {
  title: string;
  datetime: string | Date;         // ISO string or Date
  description?: string;
  isOwner?: boolean;                // true => show Edit button
  isReady?: boolean;               // true => show Ready button
  onView?: () => void;
  onOpenTasks?: () => void;
  onEdit?: () => void;
  onReady?: () => void;
  onClickCard?: () => void;        // optional click anywhere
};

// Example: Fetch from a database (starter code for two fetch + .then statements)
function onStartProcessForAgenda(title: string) {
  // so this should just call a route that retrieves from database and then starts the process

  console.log(title);
  // Hardcoded response data for testing
  const meetings = [
  {
    "user": "Kenji Tanaka",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "The only thing that matters is deciding on our response plan for the Aquila vulnerability. We need to decide whether we patch immediately and risk breaking things, or wait and do more testing. Also, I think we should talk about the Q4 offsite location at some point, people have been asking."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "I have been coordinating with our legal and PR teams all morning. We have a draft of a public disclosure statement ready to go, and an internal comms plan for our customer support staff. We are prepared to communicate whatever decision this team makes."
      },
      {
        "question": "What are the most significant blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "response": "The blocker is the lack of a unified technical recommendation. I am getting conflicting signals from the security and platform teams about the severity and the risk of the patch. We need one clear path forward from this meeting so we can execute the communications plan."
      }
    ]
  },
  {
    "user": "Sarah Lee",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "My topic is the immediate patching of the Aquila vulnerability (CVE-2025-12345). We have evidence that this is being actively exploited in the wild, and every hour we wait increases our liability. This is a five-alarm fire."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "My security team developed a hotfix patch last night. It directly addresses the remote code execution vulnerability by sanitizing the input in the `ImageUpload` service. We've tested it in an isolated environment and it closes the exploit vector completely. The patch consists of about 50 lines of code in the main Java monolith."
      },
      {
        "question": "What are the most significant blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "response": "The blocker is pushback from the platform team on deploying the hotfix immediately. They are concerned about performance impacts. I believe the risk of a breach far outweighs the risk of a minor performance degradation. We need a decision to deploy now."
      }
    ]
  },
  {
    "user": "Michael Brown",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "I want to discuss the potential performance and stability risks of Sarah's proposed hotfix for Aquila. I also need to give a quick update on our cloud cost-saving initiative."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "My platform team reviewed the patch. While it does fix the security hole, our initial performance modeling suggests it could increase CPU load on the image processing servers by up to 30% due to the new sanitization routine. This could cause cascading failures during peak traffic. We're talking about a potential site-wide outage."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "response": "My team is blocking the immediate deployment. The risk of a full-site outage is, in my opinion, just as damaging as the security vulnerability itself, if not more so. We need at least 24-48 hours to properly load-test this patch in a production-like environment. The decision needed is whether we accept the outage risk or the security risk."
      }
    ]
  },
  {
    "user": "Jessica Williams",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "I need to understand the customer impact of both the vulnerability and the potential outage from the patch."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "I've prepared a report on the number of customers who use the `ImageUpload` service. It's about 60% of our active user base. An outage would be catastrophic for engagement. I have also finished the monthly customer satisfaction survey report, and the results are generally positive."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "response": "I'm blocked from preparing our customer support team because we don't have a decision. Do we prepare them for questions about a security breach, or do we prepare them for a potential site outage? We can't do both. I need a single, clear direction."
      }
    ]
  },
  {
    "user": "Tom Davis",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "My topic is the legal liability associated with the Aquila vulnerability."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "I have reviewed our terms of service and our cyber-insurance policy. We have a 72-hour window to report a known breach. Given that we know this is being actively exploited, the legal team's official recommendation is to patch immediately to demonstrate due diligence."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "response": "The risk of not patching immediately is a potential breach of contract with our enterprise customers and could void our insurance policy if a breach occurs after we were aware of the vulnerability and did not act."
      }
    ]
  },
  {
    "user": "Emily Johnson",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "I'd like to get a final list of the servers that would need to be patched so my team can be on standby."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "My SRE team has drafted a preliminary plan for a rolling deployment of the patch, but we can't finalize it without knowing the performance impact. If it's as bad as Michael says, we might need to provision extra servers, which takes time."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "response": "We're in a holding pattern. We can't act without a decision. Also, FYI, the regular weekly OS patching for the non-critical servers is scheduled for tonight at midnight."
      }
    ]
  },
  {
    "user": "Chris Rodriguez",
    "meeting": "anbc",
    "questions": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "response": "Just here to listen and understand the impact on the mobile app release scheduled for next week."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "response": "The mobile team is feature-complete for our next release. We are not directly affected by the vulnerability, but a site-wide outage would obviously prevent our users from logging in."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "response": "No direct blockers, but the risk for us is that this incident causes a delay in our own scheduled release. We need clarity on the company's priorities."
      }
    ]
  }
];
  // Do something with meetings data
  console.log("Meetings:", meetings);
  // Example: Fetch details for the first meeting
// Example: Fetch details for the first meeting
if (meetings.length > 0) {
  fetch(`http://127.0.0.1:8003/api/filter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // set content type if you're sending JSON body
    },
    // optionally, add body if needed
    body: JSON.stringify({"submissions" : meetings}),
  })
    .then((res) => res.json())
    .then((meetingDetails) => {
      // Do something with meeting details
      console.log("Meeting details:", meetingDetails);

      fetch("http://127.0.0.1:8004/api/create_agenda/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // optionally, add body here too if needed
        body: JSON.stringify(meetingDetails),
      })
        .then((res) => res.json())
        .then((agendaResult) => {
          console.log("Agenda created:", agendaResult);
        })
        .catch((err) => {
          console.error("Error creating agenda:", err);
        });
    })
    .catch((err) => {
      console.error("Error fetching meeting details:", err);
    });
}

}

export default function Meeting({
  title,
  datetime,
  description = "",
  isOwner = false,
  isReady = false,
  onView,
  onOpenTasks,
  onEdit,
  onReady,
  onClickCard,
}: MeetingProps) {
  const theme = useTheme();

  const dateObj = React.useMemo(
    () => (datetime instanceof Date ? datetime : new Date(datetime)),
    [datetime]
  );

  const timeStr = React.useMemo(() => {
    if (Number.isNaN(dateObj.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(dateObj);
  }, [dateObj]);

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'box-shadow 160ms ease, transform 160ms ease',
        '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
      }}
    >
  <CardActionArea component="div" onClick={onClickCard} sx={{ px: 4, py: 0 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography
                  variant="h6"
                  noWrap
                  title={title}
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  {title}
                </Typography>
                {!isReady && (
                  <Chip
                    size="small"
                    color="error"
                    label="Needs input"
                    sx={{ height: 22 }}
                  />
                )}
              </Stack>

              {/* Time */}
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                <ScheduleRoundedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {timeStr}
                </Typography>
              </Stack>

              {/* Truncated description (2 lines) */}
              {description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>

            {/* Actions - right aligned */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ pl: 1, ml: 'auto', minWidth: 0 }}
            >
              {/* Action buttons */}
              {!isReady && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<AssignmentLateRoundedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTasks?.();
                  }}
                >
                  Pending tasks
                </Button>
              )}

              {isOwner && (
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<EditRoundedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                >
                  Edit
                </Button>
              )}

                {isOwner && (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<EditRoundedIcon />}
                  onClick={(e) => {
                  e.stopPropagation();
                  onStartProcessForAgenda(title);
                  }}
                >
                  Create Agenda
                </Button>
                )}

              {isReady && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleRoundedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReady?.();
                  }}
                >
                  Ready to view summary
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
