import React, { useState } from "react";
import {
  Box, Typography, Pagination, CircularProgress, Alert,
  Button, Stack, Divider, Chip,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { FilterBar }         from "../components/FilterBar";
import { NotificationCard }  from "../components/NotificationCard";
import { useNotifications }  from "../hooks/useNotifications";
import { useViewed }         from "../context/ViewedContext";
import type { NotificationType } from "../api/notificationsApi";

export function AllNotificationsPage() {
  const [type,  setType]  = useState<NotificationType | "">("");
  const [limit, setLimit] = useState(10);
  const [page,  setPage]  = useState(1);

  const { notifications, loading, error, refetch } = useNotifications({
    limit,
    page,
    notification_type: type || undefined,
  });

  const { markAllViewed, unviewedCount } = useViewed();
  const newCount = unviewedCount(notifications.map(n => n.ID));

  return (
    <Box sx={{ maxWidth: 820, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Page header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h5" fontWeight={800}>All Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time campus updates — Placements, Events &amp; Results
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {newCount > 0 && (
            <Chip label={`${newCount} New`} color="error" size="small" sx={{ fontWeight: 700 }} />
          )}
          <Button
            id="mark-all-read-btn"
            size="small"
            startIcon={<MarkEmailReadIcon />}
            variant="outlined"
            onClick={() => markAllViewed(notifications.map(n => n.ID))}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Mark All Read
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <FilterBar
        type={type}
        onTypeChange={(t) => { setType(t); setPage(1); }}
        limit={limit}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onRefresh={refetch}
      />

      {/* States */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={refetch}>Retry</Button>
        }>
          {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found for the selected filters.</Alert>
      )}

      {!loading && !error && notifications.map((n) => (
        <NotificationCard key={n.ID} notification={n} />
      ))}

      {/* Pagination */}
      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            id="notifications-pagination"
            count={Math.max(page, notifications.length === limit ? page + 1 : page)}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
