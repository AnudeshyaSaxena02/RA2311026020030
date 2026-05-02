import type { Notification } from "../api/notificationsApi";

export const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

export interface ScoredNotification extends Notification {
  score: number;
}

export function computeScore(n: Notification, now: Date = new Date()): number {
  const weight  = TYPE_WEIGHT[n.Type] ?? 1;
  const ageSec  = Math.max(0, (now.getTime() - new Date(n.Timestamp).getTime()) / 1000);
  return weight / (1 + ageSec);
}

// ─── Min-Heap ────────────────────────────────────────────────────────────────
// Root = item with LOWEST score among top-N.
// Each insert is O(log N), making streaming updates efficient.

export class MinHeap {
  private heap: ScoredNotification[] = [];
  constructor(private maxSize: number) {}

  get size() { return this.heap.length; }

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

  push(item: ScoredNotification) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    } else if (item.score > this.heap[0].score) {
      this.heap[0] = item;
      this.sinkDown(0);
    }
  }

  getTopN(): ScoredNotification[] {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }
}

export function getTopNPriority(notifications: Notification[], n: number): ScoredNotification[] {
  const now  = new Date();
  const heap = new MinHeap(n);
  for (const notification of notifications) {
    heap.push({ ...notification, score: computeScore(notification, now) });
  }
  return heap.getTopN();
}
