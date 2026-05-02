/**
 * Stage 1 — Priority Inbox Algorithm
 * Campus Notification Platform
 *
 * Strategy:
 *   score = type_weight × recency_factor
 *   type_weight : Placement=3, Result=2, Event=1
 *   recency_factor : 1 / (1 + age_in_seconds)   (newer → higher)
 *
 * Data structure: Min-Heap of size N
 *   - Root always holds the LOWEST score among top-N
 *   - Per-insert cost: O(log N)  → efficient for streaming notifications
 *   - When a new notification arrives:
 *       if heap.size < N  → push directly
 *       else if score > heap.root.score → replace root and sift down
 *
 * Run:
 *   npx tsx stage1_priority_inbox.ts
 *   API_TOKEN=<your-token> npx tsx stage1_priority_inbox.ts
 */

const API_URL = "http://20.244.56.144/evaluation-service/notifications";
const API_TOKEN = process.env.API_TOKEN ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhczc3OTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDUwOCwiaWF0IjoxNzc3NzAzNjA4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiM2UxODUyNzYtMmYxMS00NTFlLTkzM2ItNzkzNDczYWQyOGFjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW51ZGVzaHlhX3NheGVuYSIsInN1YiI6IjliOTA5NzQzLWMxMWItNDlhNS04ZjMxLWE0YjRlZjhjNGQ0NSJ9LCJlbWFpbCI6ImFzNzc5MUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImFudWRlc2h5YV9zYXhlbmEiLCJyb2xsTm8iOiJyYTIzMTEwMjYwMjAwMzAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI5YjkwOTc0My1jMTFiLTQ5YTUtOGYzMS1hNGI0ZWY4YzRkNDUiLCJjbGllbnRTZWNyZXQiOiJkenpCYkVWTUhZeHpzUkZHIn0.C7NM3xUARevhitUU9C5AikiHNInSDbnPejkmcFFUo0w";
const TOP_N     = 10;

// ── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  ID:        string;
  Type:      "Placement" | "Result" | "Event";
  Message:   string;
  Timestamp: string;
}

interface ApiResponse {
  notifications: Notification[];
}

interface ScoredNotification extends Notification {
  score: number;
}

// ── Weights ──────────────────────────────────────────────────────────────────

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

function computeScore(n: Notification, now: Date): number {
  const weight      = TYPE_WEIGHT[n.Type] ?? 1;
  const ageSec      = Math.max(0, (now.getTime() - new Date(n.Timestamp).getTime()) / 1000);
  const recency     = 1 / (1 + ageSec);
  return weight * recency;
}

// ── Min-Heap ─────────────────────────────────────────────────────────────────

class MinHeap {
  private heap: ScoredNotification[] = [];
  constructor(private maxSize: number) {}

  get size() { return this.heap.length; }
  get minScore() { return this.heap[0]?.score ?? -Infinity; }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i].score >= this.heap[p].score) break;
      this.swap(i, p);
      i = p;
    }
  }

  private sinkDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].score < this.heap[min].score) min = l;
      if (r < n && this.heap[r].score < this.heap[min].score) min = r;
      if (min === i) break;
      this.swap(i, min);
      i = min;
    }
  }

  /** O(log N) push — maintains top-N by score */
  push(item: ScoredNotification) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    } else if (item.score > this.heap[0].score) {
      this.heap[0] = item;
      this.sinkDown(0);
    }
    // else: item is not good enough for top-N, discard
  }

  /** Returns top-N sorted descending by score */
  getTopN(): ScoredNotification[] {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }
}

// ── API Fetch ─────────────────────────────────────────────────────────────────

async function fetchNotifications(): Promise<Notification[]> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_TOKEN) headers["Authorization"] = `Bearer ${API_TOKEN}`;

  const res = await fetch(API_URL, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = (await res.json()) as ApiResponse;
  return data.notifications ?? [];
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔔  Campus Notification — Priority Inbox (Top ${TOP_N})\n`);
  console.log(`Fetching from: ${API_URL}\n`);

  const notifications = await fetchNotifications();
  console.log(`Total notifications received: ${notifications.length}\n`);

  const now  = new Date();
  const heap = new MinHeap(TOP_N);

  for (const n of notifications) {
    heap.push({ ...n, score: computeScore(n, now) });
  }

  const topN = heap.getTopN();

  console.log("─".repeat(80));
  console.log(` Rank  Type        Score (×10⁻⁴)   Message`);
  console.log("─".repeat(80));

  topN.forEach((n, i) => {
    const rank  = String(i + 1).padStart(2);
    const type  = n.Type.padEnd(10);
    const score = (n.score * 1e4).toFixed(4).padStart(14);
    console.log(` #${rank}  ${type}  ${score}   ${n.Message}`);
    console.log(`        ID: ${n.ID}   Time: ${n.Timestamp}`);
  });

  console.log("─".repeat(80));
  console.log(`\n✅  Top ${topN.length} priority notifications displayed.\n`);

  // Demonstrate streaming efficiency:
  // When a new notification arrives, call heap.push({ ...newNotification, score: computeScore(newNotification, new Date()) })
  // This is O(log N) — the heap self-maintains the top-N without re-sorting.
  console.log("💡  Streaming note: each new notification insert = O(log N) via min-heap.\n");
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
