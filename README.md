# Campus Notifications System

## 📌 Overview

This project is a **Campus Notification Platform** built as part of the hiring evaluation.
It processes and displays notifications related to **Placements, Results, and Events**, prioritizing them based on importance and recency.

---

## 🚀 Features

### ✅ Stage 1 (Core Logic)

* Fetch notifications from protected API
* Apply **priority-based ranking**
* Display **Top N notifications**
* Logging integrated across:

  * API calls
  * Processing logic
  * Error handling

### ✅ Stage 2 (Frontend)

* Built using **React + TypeScript (Vite)**
* Responsive UI (Desktop + Mobile)
* Priority Inbox view
* Filters:

  * Notification type
  * Top N selection
* Error handling (401, API failure)
* Clean UI with focus on usability

---

## 🧠 Priority Logic

Notifications are ranked based on:

1. **Type Weight**

   * Placement → 3
   * Result → 2
   * Event → 1

2. **Recency**

   * Latest notifications are prioritized

### Sorting Strategy:

```text
Sort by:
1. Type weight (descending)
2. Timestamp (descending)
```

---

## 🏗️ Project Structure

```
RA2311026020030/
│
├── logging_middleware/
│   ├── config.ts
│   ├── logger.ts
│
├── notification_app_fe/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│
├── notification_app_be/
│
├── notification_system_design.md
├── screenshots/
```

---

## 🔐 Authentication

All APIs are **protected** and require:

```http
Authorization: Bearer <access_token>
```

---

## 📡 API Endpoints

### 🔹 Get Notifications

```
GET /evaluation-service/notifications
```

---

## 📸 Screenshots

### 🔹 Stage 1 Output

![Stage1](./screenshots/stage1/stage1-output.png)

### 🔹 Logs

![Logs](./screenshots/stage1/logs.png)

### 🔹 UI (Desktop)

![Desktop](./screenshots/stage2/ui-desktop.png)

### 🔹 UI (Mobile)

![Mobile](./screenshots/stage2/ui-mobile.png)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd RA2311026020030
```

### 2. Install Dependencies

```bash
cd notification_app_fe
npm install
```

### 3. Run Application

```bash
npm run dev
```

### 4. Open in Browser

```
http://localhost:5173
```

---

## 🧾 Logging Middleware

A reusable logging utility is implemented:

```ts
Log(stack, level, package, message)
```

### Supported Values:

* **Stack**: frontend
* **Level**: debug, info, warn, error, fatal
* **Package**: api, component, state, etc.

---

## 📊 Logging Coverage

Logs are captured for:

* API request start/end
* Errors
* State updates
* Component lifecycle events

---

## ⚠️ Error Handling

* 401 Unauthorized → Token validation
* API failure → Retry + logging
* Graceful UI fallback

---

## 📈 Performance Considerations

* Sorting complexity: **O(n log n)**
* Can be optimized using:

  * Heap / priority queue for real-time updates

---

## 💡 Key Design Decisions

* Modular structure for scalability
* Logging middleware for observability
* Separation of concerns (API, UI, utils)
* Clean and maintainable codebase

---

## 🏁 Conclusion

This system demonstrates:

* Efficient data processing
* Clean architecture
* Real-world logging practices
* Scalable frontend design

---

## 👨‍💻 Author

RA2311026020030
