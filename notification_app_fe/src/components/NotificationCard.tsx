import React, { useEffect } from "react";
import { Card, CardContent, Typography, Chip, Box, Stack, Tooltip } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventIcon from "@mui/icons-material/Event";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { Notification } from "../api/notificationsApi";
import { useViewed } from "../context/ViewedContext";

const TYPE_CONFIG = {
  Placement: { color: "success" as const, icon: <WorkIcon fontSize="small" />,       border: "#2e7d32" },
  Result:    { color: "warning" as const, icon: <AssessmentIcon fontSize="small" />, border: "#e65100" },
  Event:     { color: "info"    as const, icon: <EventIcon fontSize="small" />,      border: "#0277bd" },
};

interface Props {
  notification: Notification;
  score?:       number;
  rank?:        number;
}

export function NotificationCard({ notification, score, rank }: Props) {
  const { isViewed, markViewed } = useViewed();
  const viewed = isViewed(notification.ID);
  const cfg    = TYPE_CONFIG[notification.Type] ?? TYPE_CONFIG.Event;

  // Auto-mark as viewed 2 s after render (user has seen it)
  useEffect(() => {
    const t = setTimeout(() => markViewed(notification.ID), 2000);
    return () => clearTimeout(t);
  }, [notification.ID, markViewed]);

  return (
    <Card
      id={`notif-${notification.ID}`}
      elevation={viewed ? 1 : 3}
      sx={{
        mb: 1.5,
        borderLeft: "4px solid",
        borderLeftColor: viewed ? "divider" : cfg.border,
        opacity: viewed ? 0.82 : 1,
        transition: "all 0.3s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Header row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
            {rank && (
              <Chip
                label={`#${rank}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 800, borderRadius: 1 }}
              />
            )}
            <Chip
              icon={cfg.icon}
              label={notification.Type}
              color={cfg.color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            {!viewed && (
              <Chip
                icon={<FiberManualRecordIcon sx={{ fontSize: "10px !important" }} />}
                label="New"
                size="small"
                color="error"
                sx={{ fontWeight: 700, animation: "pulse 2s infinite" }}
              />
            )}
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{ mt: 1, fontWeight: viewed ? 400 : 700, fontSize: "0.95rem" }}
        >
          {notification.Message}
        </Typography>

        {/* Score (priority inbox only) */}
        {score !== undefined && (
          <Tooltip title="Priority score = type_weight × recency_factor" arrow>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              Score: {score.toExponential(3)}
            </Typography>
          </Tooltip>
        )}

        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.25 }}>
          {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}
