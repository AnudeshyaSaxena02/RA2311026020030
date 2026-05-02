import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { NotificationType } from "../api/notificationsApi";

interface Props {
  type:           NotificationType | "";
  onTypeChange:   (t: NotificationType | "") => void;
  limit:          number;
  onLimitChange:  (n: number) => void;
  limitLabel?:    string;
  limitOptions?:  number[];
  onRefresh?:     () => void;
}

export function FilterBar({
  type, onTypeChange,
  limit, onLimitChange,
  limitLabel = "Per Page",
  limitOptions = [5, 10, 15, 20, 25, 50],
  onRefresh,
}: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ sm: "center" }}
      sx={{ mb: 3, flexWrap: "wrap" }}
    >
      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="type-filter-label">Notification Type</InputLabel>
        <Select
          id="type-filter"
          labelId="type-filter-label"
          value={type}
          label="Notification Type"
          onChange={(e) => onTypeChange(e.target.value as NotificationType | "")}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel id="limit-label">{limitLabel}</InputLabel>
        <Select
          id="limit-select"
          labelId="limit-label"
          value={limit}
          label={limitLabel}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {limitOptions.map((v) => (
            <MenuItem key={v} value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {onRefresh && (
        <Button
          id="refresh-btn"
          startIcon={<RefreshIcon />}
          variant="outlined"
          size="small"
          onClick={onRefresh}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Refresh
        </Button>
      )}
    </Stack>
  );
}
