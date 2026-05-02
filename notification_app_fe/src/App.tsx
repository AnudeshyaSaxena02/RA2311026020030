import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ViewedProvider, useViewed }  from "./context/ViewedContext";
import { Navbar }                     from "./components/Navbar";
import { AllNotificationsPage }       from "./pages/AllNotificationsPage";
import { PriorityInboxPage }          from "./pages/PriorityInboxPage";
import { useNotifications }           from "./hooks/useNotifications";

// ── MUI Theme ────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: "#1a237e" },
    secondary: { main: "#283593" },
    background: { default: "#f4f6fb", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

// ── Inner app (needs ViewedContext + live notification count for Navbar) ──────
function AppInner() {
  const { notifications } = useNotifications({ limit: 10 });
  const { unviewedCount } = useViewed();
  const unread = unviewedCount(notifications.map(n => n.ID));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar unreadCount={unread} />
      <Box component="main" sx={{ pt: 1 }}>
        <Routes>
          <Route path="/"         element={<AllNotificationsPage />} />
          <Route path="/priority" element={<PriorityInboxPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ViewedProvider>
          <AppInner />
        </ViewedProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
