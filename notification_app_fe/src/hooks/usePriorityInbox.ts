import { useMemo } from "react";
import type { Notification } from "../api/notificationsApi";
import { getTopNPriority, type ScoredNotification } from "../utils/priorityInbox";

export function usePriorityInbox(notifications: Notification[], n: number): ScoredNotification[] {
  return useMemo(() => getTopNPriority(notifications, n), [notifications, n]);
}
