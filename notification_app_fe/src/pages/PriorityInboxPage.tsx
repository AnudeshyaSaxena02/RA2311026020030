import React, { useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Button,
  Stack, Divider, Chip, Paper, LinearProgress, Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FilterBar }         from "../components/FilterBar";
import { NotificationCard }  from "../components/NotificationCard";
import { useNotifications }  from "../hooks/useNotifications";
import { usePriorityInbox }  from "../hooks/usePriorityInbox";
import { useViewed }         from "../context/ViewedContext";
import { TYPE_WEIGHT }       from "../utils/priorityInbox";
import type { NotificationType } from "../api/notificationsApi";

export function PriorityInboxPage() {
  const [type,  setType]  = useState<NotificationType | "">("");
  const [topN,  setTopN]  = useState(10);

  // Fetch ALL notifications (no server-side limit for priority computation)
  const { notifications, loading, error, refetch } = useNotifications({
    notification_type: type || undefined,
  });

  const prioritized = usePriorityInbox(notifications, topN);
  const { unviewedCount } = useViewed();
  const newCount = unviewedCount(prioritized.map(n => n.ID));

  const maxScore = prioritized[0]?.score ?? 1;

  return (
    <Box sx={{ maxWidth: 820, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <StarIcon color="warning" />
            <Typography variant="h5" fontWeight={800}>Priority Inbox</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Top-N notifications ranked by type weight × recency
          </Typography>
        </Box>
        {newCount > 0 && (
          <Chip label={`${newCount} New`} color="error" size="small" sx={{ fontWeight: 700 }} />
        )}
      </Stack>

      {/* Weight legend */}
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Tooltip title="Priority score = type_weight × (1 / (1 + age_in_seconds))" arrow>
          <InfoOutlinedIcon fontSize="small" color="action" sx={{ cursor: "help" }} />
        </Tooltip>
        {Object.entries(TYPE_WEIGHT).map(([t, w]) => (
          <Chip
            key={t}
            label={`${t}: weight ${w}`}
            size="small"
            color={t === "Placement" ? "success" : t === "Result" ? "warning" : "info"}
            variant="outlined"
          />
        ))}
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <FilterBar
        type={type}
        onTypeChange={(t) => setType(t)}
        limit={topN}
        onLimitChange={setTopN}
        limitLabel="Top N"
        limitOptions={[5, 10, 15, 20, 25]}
        onRefresh={refetch}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={refetch}>Retry</Button>
        }>
          {error}
        </Alert>
      )}

      {!loading && !error && prioritized.length === 0 && (
        <Alert severity="info">No notifications available for the selected filters.</Alert>
      )}

      {!loading && !error && prioritized.map((n, i) => (
        <Box key={n.ID}>
          {/* Relative priority bar */}
          <Tooltip title={`Priority score: ${n.score.toExponential(3)}`} arrow placement="left">
            <LinearProgress
              variant="determinate"
              value={(n.score / maxScore) * 100}
              color={n.Type === "Placement" ? "success" : n.Type === "Result" ? "warning" : "info"}
              sx={{ height: 3, borderRadius: 1, mb: 0.3, mx: 0.5 }}
            />
          </Tooltip>
          <NotificationCard notification={n} score={n.score} rank={i + 1} />
        </Box>
      ))}

      {!loading && !error && prioritized.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
          Showing top {prioritized.length} of {notifications.length} notifications • Auto-refreshes every 30s
        </Typography>
      )}
    </Box>
  );
}
