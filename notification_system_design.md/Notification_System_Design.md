# Stage 1

## Problem Statement

The campus notification platform receives a continuous stream of Placement, Event, and Result notifications. Users lose track of important ones due to high volume. The solution is a **Priority Inbox** that always surfaces the top *N* most important unread notifications.

---

## Priority Model

Priority is determined by two factors:

### 1. Type Weight

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Placement notifications are most critical (job opportunities are time-sensitive), Results are next (academic impact), and Events are least urgent.

### 2. Recency Factor

```
recency_factor = 1 / (1 + age_in_seconds)
```

A notification posted 0 seconds ago has recency = 1.0; one posted 1 hour ago has recency ≈ 0.000278. This ensures recent notifications naturally rank higher within the same type.

### Combined Score

```
score = type_weight × recency_factor
```

---

## Algorithm — Min-Heap of Size N

### Why a Min-Heap?

Naive approach: sort all notifications every time → O(k log k) per query.

Better: maintain a **min-heap of exactly N elements** where the root is always the *lowest* score among the current top-N.

**Per-notification insertion cost: O(log N)**

```
for each incoming notification:
    score = compute_score(notification)
    if heap.size < N:
        heap.push(notification)          # O(log N)
    elif score > heap.root.score:
        heap.replace_root(notification)  # O(log N)
    # else: discard — not good enough for top-N
```

### Streaming / Live Updates

When new notifications arrive (via polling or WebSocket):
1. Compute their score using the current timestamp.
2. Call `heap.push(newNotification)` — O(log N).
3. No full re-sort needed. The heap self-adjusts.

This is efficient even at scale — e.g., top-10 out of 1 million notifications still costs only O(log 10) = ~3 comparisons per insert.

---

## Implementation Details

- **Language**: TypeScript (Node.js, runs with `npx tsx`)
- **API**: `GET http://20.207.122.201/evaluation-service/notifications`
- **Auth**: Bearer token via `API_TOKEN` environment variable
- **Top N**: Configurable constant (`TOP_N = 10` by default)

### Running

```bash
API_TOKEN=<your-token> npx tsx stage1_priority_inbox.ts
```

### Output Example

```
─────────────────────────────────────────────────────────────────────────────
 Rank  Type        Score (×10⁻⁴)   Message
─────────────────────────────────────────────────────────────────────────────
 # 1  Placement       0.0498   CSX Corporation hiring
        ID: b283218f-ea5a-4b7c-93a9-1f2f240d64b0   Time: 2026-04-22 17:51:18
 # 2  Result          0.0332   mid-sem
        ...
─────────────────────────────────────────────────────────────────────────────
```

---

## Complexity Summary

| Operation              | Time       | Space  |
|------------------------|------------|--------|
| Initial build (k items)| O(k log N) | O(N)   |
| Single insert          | O(log N)   | O(1)   |
| Extract top-N sorted   | O(N log N) | O(N)   |

Space is O(N) — only the top-N are kept in memory, regardless of total notification count.

---

## Stage 2 Overview

Stage 2 implements a full React frontend (Vite + Material UI) that:
- Fetches all notifications with pagination and type filters
- Displays priority inbox using the same min-heap algorithm
- Tracks new vs. viewed status via `localStorage`
- Polls the API every 30 seconds for live updates
- Runs on `http://localhost:3000`
