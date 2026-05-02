import { useState, useEffect, useCallback, useRef } from "react";
import { fetchNotifications, type Notification, type FetchParams } from "../api/notificationsApi";

const POLL_MS = 30_000;

export interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNotifications(params: FetchParams): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(paramsRef.current);
      setNotifications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch when filter params change
  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, params.notification_type, params.limit, params.page]);

  return { notifications, loading, error, refetch: load };
}
