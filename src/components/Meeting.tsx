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

type MeetingProps = {
  name: string;
  datetime: string | Date;         // ISO string or Date
  description?: string;
  hasPendingTasks?: boolean;       // true => show "Pending tasks"
  isManager?: boolean;             // true => show Edit
  onView?: () => void;
  onOpenTasks?: () => void;
  onEdit?: () => void;
  onClickCard?: () => void;        // optional click anywhere
};

export default function Meeting({
  name,
  datetime,
  description = "",
  hasPendingTasks = false,
  isManager = false,
  onView,
  onOpenTasks,
  onEdit,
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

  const PrimaryButton = hasPendingTasks ? (
    <Button
      variant="contained"
      color="warning"
      startIcon={<AssignmentLateRoundedIcon />}
      onClick={(e) => {
        e.stopPropagation();
        onOpenTasks?.();
      }}
    >
      Pending tasks
    </Button>
  ) : (
    <Button
      variant="outlined"
      startIcon={<VisibilityRoundedIcon />}
      onClick={(e) => {
        e.stopPropagation();
        onView?.();
      }}
    >
      View
    </Button>
  );

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
      <CardActionArea onClick={onClickCard} sx={{ p: 0 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography
                  variant="h6"
                  noWrap
                  title={name}
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  {name}
                </Typography>
                {hasPendingTasks && (
                  <Chip
                    size="small"
                    color="warning"
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
              {/* Primary action (small) */}
                {hasPendingTasks ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    startIcon={<AssignmentLateRoundedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTasks?.();
                    }}
                  >
                    Pending tasks
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView?.();
                    }}
                  >
                    View
                  </Button>
                )}

              {isManager && (
                <Tooltip title="Edit meeting">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    aria-label="Edit meeting"
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
