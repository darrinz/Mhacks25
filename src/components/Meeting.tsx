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
  fetch(`http://localhost:3000/api/get_responses?title=${encodeURIComponent(title)}`)
    .then((res) => res.json())
    .then((meetings) => {
      // Do something with meetings data
      console.log("Meetings:", meetings);
      // Example: Fetch details for the first meeting
      if (meetings.length > 0) {
        fetch(`/api/meetings/${meetings[0].id}`)
          .then((res) => res.json())
          .then((meetingDetails) => {
            // Do something with meeting details
            console.log("Meeting details:", meetingDetails);
          })
          .catch((err) => {
            // Handle error for details fetch
            console.error("Error fetching meeting details:", err);
          });
      }
    })
    .catch((err) => {
      // Handle error for meetings fetch
      console.error("Error fetching meetings:", err);
    });
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
