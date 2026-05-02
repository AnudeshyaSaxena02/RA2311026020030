// Requests go through the Vite dev proxy (/api → http://20.207.122.201)
// This bypasses the server's broken CORS header (multiple Access-Control-Allow-Origin values).
const BASE_URL = "/api/evaluation-service/notifications";

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "";
}

export async function fetchNotifications(params: FetchParams = {}): Promise<Notification[]> {
  // Build query string using URLSearchParams (works with relative paths)
  const qs = new URLSearchParams();
  if (params.limit)             qs.set("limit", String(params.limit));
  if (params.page)              qs.set("page",  String(params.page));
  if (params.notification_type) qs.set("notification_type", params.notification_type);

  const qsStr  = qs.toString();
  const fullUrl = qsStr ? `${BASE_URL}?${qsStr}` : BASE_URL;

  const token = import.meta.env.VITE_API_TOKEN as string | undefined;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(fullUrl, { headers });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);

  const data = await res.json() as { notifications: Notification[] };
  return data.notifications ?? [];
}
