import React from "react";
import { AppBar, Toolbar, Typography, Button, Badge, Box, Stack } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  unreadCount: number;
}

export function Navbar({ unreadCount }: Props) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Badge badgeContent={unreadCount || null} color="error">
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography
          variant="h6"
          fontWeight={800}
          letterSpacing={0.5}
          sx={{ flexGrow: 1, cursor: "pointer", userSelect: "none" }}
          onClick={() => navigate("/")}
        >
          Campus Notify
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            id="nav-all"
            color="inherit"
            startIcon={<NotificationsIcon />}
            onClick={() => navigate("/")}
            variant={pathname === "/" ? "outlined" : "text"}
            sx={{ borderColor: "rgba(255,255,255,0.5)", borderRadius: 2, fontWeight: 600 }}
          >
            All
          </Button>
          <Button
            id="nav-priority"
            color="inherit"
            startIcon={<StarIcon />}
            onClick={() => navigate("/priority")}
            variant={pathname === "/priority" ? "outlined" : "text"}
            sx={{ borderColor: "rgba(255,255,255,0.5)", borderRadius: 2, fontWeight: 600 }}
          >
            Priority Inbox
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
