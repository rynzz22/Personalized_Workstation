# Talibon Workspace — API Plan

> *"Your work, your dashboard, your way."*
> Personalized Productivity, Planning and Progress Platform

| | |
|---|---|
| **Doc version** | 1.0 |
| **Date** | 2026-10-05 |
| **Source** | Talibon Workspace Business Pitch Plan |
| **Stack** | NestJS · PostgreSQL (Supabase) · React · Vite · Tailwind CSS |

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Response Formats](#2-response-formats)
3. [Error Handling](#3-error-handling)
4. [API Endpoints](#4-api-endpoints)
5. [Example Payloads](#5-example-payloads)

---

## 1. API Conventions

### 1.1 General Conventions

| Item | Convention |
|---|---|
| Base URL | `/api/v1` |
| Auth | `Authorization: Bearer <supabase_access_token>` on all routes except `/health` |
| Workspace scoping | Domain routes are nested: `/workspaces/:workspaceId/...` |
| Content type | `application/json` |
| Pagination | `?page=1&limit=20&sort=created_at&order=desc&q=search` |
| Filtering | Query params per resource (e.g., `status`, `from`, `to`) |
| IDs | UUID |
| Dates | ISO 8601 UTC |
| Docs | Swagger UI at `/api/docs` |

### 1.2 Role Legend

| Code | Role |
|---|---|
| V | viewer |
| M | member |
| A | admin |
| O | owner |

A route lists the minimum role required.

### 1.3 Phase Legend

P1–P6 map to the roadmap in the Tasks Plan:
- P1: Phase 1 - Core platform
- P2: Phase 2 - Teacher and Student MVP
- P3: Phase 3 - Documents, focus tracker, notifications, gating
- P4: Phase 4 - Finance, business workspaces, custom trackers
- P5: Phase 5 - Advanced analytics, school package, integrations
- P6: Phase 6 - AI assistant

---

## 2. Response Formats

### 2.1 Success Envelope

All successful responses are wrapped in an envelope:

```json
{
  "data": { },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 134
  }
}
```

The `meta` field is included for paginated responses.

### 2.2 Error Envelope

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [
      { "field": "title", "message": "must not be empty" }
    ],
    "requestId": "b1f1..."
  }
}
```

### 2.3 HTTP Status Codes

| HTTP | Code | Description |
|---|---|---|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHENTICATED | JWT invalid or expired |
| 403 | FORBIDDEN | Insufficient permissions |
| 403 | PLAN_LIMIT_REACHED | Feature not available on current plan |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (duplicate) |
| 422 | BUSINESS_RULE_VIOLATION | Business rule violated |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected error |

---

## 3. Error Handling

### 3.1 Validation Errors

**Status**: 400
**Code**: VALIDATION_ERROR

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "must not be empty" },
      { "field": "priority", "message": "must be one of: low, medium, high, urgent" }
    ],
    "requestId": "abc123"
  }
}
```

### 3.2 Authentication Errors

**Status**: 401
**Code**: UNAUTHENTICATED

```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Invalid or expired token",
    "requestId": "abc123"
  }
}
```

### 3.3 Authorization Errors

**Status**: 403
**Code**: FORBIDDEN

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "requestId": "abc123"
  }
}
```

### 3.4 Plan Limit Errors

**Status**: 403
**Code**: PLAN_LIMIT_REACHED

```json
{
  "error": {
    "code": "PLAN_LIMIT_REACHED",
    "message": "This feature requires a Premium subscription",
    "requestId": "abc123"
  }
}
```

### 3.5 Not Found Errors

**Status**: 404
**Code**: NOT_FOUND

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Workspace not found",
    "requestId": "abc123"
  }
}
```

### 3.6 Business Rule Violations

**Status**: 422
**Code**: BUSINESS_RULE_VIOLATION

```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot delete workspace with active members",
    "requestId": "abc123"
  }
}
```

---

## 4. API Endpoints

### 4.1 Health and Auth

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/health` | Liveness | public | 1 |
| GET | `/health/ready` | Readiness (DB check) | public | 1 |
| GET | `/me` | Current profile + workspace list + plan | auth | 1 |
| PATCH | `/me` | Update name, avatar, locale, timezone, preferences | auth | 1 |
| DELETE | `/me` | Delete account and owned data | auth | 2 |
| POST | `/me/onboarding` | Save primary role and create first workspace from template | auth | 1 |

> Sign-up, sign-in, password reset, OAuth and token refresh are performed by `supabase-js` in the frontend. The API only verifies tokens and lazily creates the `profiles` row on first `/me`.

### 4.2 Templates, Workspaces, Members

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/templates` | List role templates | auth | 1 |
| GET | `/templates/:key` | Template detail (modules, widgets preview) | auth | 1 |
| GET | `/workspaces` | List workspaces of current user | auth | 1 |
| POST | `/workspaces` | Create workspace `{name, template, icon, color}`; applies template | auth | 1 |
| GET | `/workspaces/:wid` | Workspace detail | V | 1 |
| PATCH | `/workspaces/:wid` | Rename, icon, color, settings | A | 1 |
| DELETE | `/workspaces/:wid` | Soft-delete workspace | O | 1 |
| POST | `/workspaces/:wid/duplicate` | Clone structure (modules, widgets) without data | O | 3 |
| GET | `/workspaces/:wid/members` | List members | V | 5 |
| POST | `/workspaces/:wid/invitations` | Invite by email | A | 5 |
| POST | `/invitations/:token/accept` | Accept invitation | auth | 5 |
| PATCH | `/workspaces/:wid/members/:userId` | Change role | A | 5 |
| DELETE | `/workspaces/:wid/members/:userId` | Remove member / leave | A | 5 |

### 4.3 Modules and Dashboard (Workspace Builder)

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/modules/catalog` | All available modules (filtered by plan) | auth | 1 |
| GET | `/workspaces/:wid/modules` | Modules and enabled state | V | 1 |
| PUT | `/workspaces/:wid/modules/:key` | Enable/disable `{enabled, settings}` | A | 1 |
| GET | `/widgets/catalog` | Widget types (optionally `?module=tasks`) | auth | 1 |
| GET | `/workspaces/:wid/dashboard` | Settings + widgets (layout) | V | 1 |
| PATCH | `/workspaces/:wid/dashboard/settings` | `{priority_module, layout_mode}` | M | 1 |
| POST | `/workspaces/:wid/dashboard/widgets` | Add widget `{widget_type, config, x,y,w,h,zone}` | M | 1 |
| PATCH | `/workspaces/:wid/dashboard/widgets/:id` | Update title/config/visibility | M | 1 |
| PUT | `/workspaces/:wid/dashboard/layout` | Bulk save positions/sizes `[{id,x,y,w,h,zone,position}]` | M | 1 |
| DELETE | `/workspaces/:wid/dashboard/widgets/:id` | Remove widget | M | 1 |
| GET | `/workspaces/:wid/dashboard/data` | Aggregated data for all visible widgets (single round trip; `?widgets=id1,id2` to limit) | V | 1 |
| POST | `/workspaces/:wid/dashboard/reset` | Reset to template default layout | A | 2 |

### 4.4 Tasks and Projects

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/tasks` | List; filters `status, priority, projectId, goalId, due_from, due_to, assigneeId, q` | V | 1 |
| POST | `/workspaces/:wid/tasks` | Create | M | 1 |
| GET | `/workspaces/:wid/tasks/:id` | Detail incl. subtasks | V | 1 |
| PATCH | `/workspaces/:wid/tasks/:id` | Update | M | 1 |
| POST | `/workspaces/:wid/tasks/:id/complete` | Mark done (sets `completed_at`) | M | 1 |
| POST | `/workspaces/:wid/tasks/reorder` | Bulk reorder `[{id, sort_order}]` | M | 1 |
| DELETE | `/workspaces/:wid/tasks/:id` | Soft delete | M | 1 |
| GET | `/workspaces/:wid/tasks/summary` | `{done, total, overdue, dueToday}` for the Tasks widget | V | 1 |
| GET/POST | `/workspaces/:wid/projects` | List / create | V / M | 4 |
| GET/PATCH/DELETE | `/workspaces/:wid/projects/:id` | Detail / update / delete | V / M / M | 4 |

### 4.5 Notes

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/notes` | List; `categoryId, pinned, q` | V | 1 |
| POST | `/workspaces/:wid/notes` | Create | M | 1 |
| GET | `/workspaces/:wid/notes/:id` | Detail | V | 1 |
| PATCH | `/workspaces/:wid/notes/:id` | Update (autosave friendly) | M | 1 |
| DELETE | `/workspaces/:wid/notes/:id` | Soft delete | M | 1 |
| GET | `/workspaces/:wid/note-categories` | Tree (School > Math, Work > Ideas...) | V | 1 |
| POST | `/workspaces/:wid/note-categories` | Create | M | 1 |
| PATCH/DELETE | `/workspaces/:wid/note-categories/:id` | Update / delete | M | 1 |

### 4.6 Calendar

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/events` | `?from=&to=` range query (expands recurrence) | V | 1 |
| GET | `/workspaces/:wid/events/today` | Today's agenda (events + due tasks + class schedule) | V | 1 |
| POST | `/workspaces/:wid/events` | Create | M | 1 |
| PATCH | `/workspaces/:wid/events/:id` | Update | M | 1 |
| DELETE | `/workspaces/:wid/events/:id` | Delete | M | 1 |

### 4.7 Goals and Milestones

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/goals` | List with computed progress | V | 1 |
| POST | `/workspaces/:wid/goals` | Create goal `{title, type, target_value, target_date}` | M | 1 |
| GET | `/workspaces/:wid/goals/:id` | Detail with milestones and linked tasks | V | 1 |
| PATCH | `/workspaces/:wid/goals/:id` | Update | M | 1 |
| DELETE | `/workspaces/:wid/goals/:id` | Delete | M | 1 |
| POST | `/workspaces/:wid/goals/:id/milestones` | Add milestone | M | 1 |
| PATCH | `/workspaces/:wid/goals/:id/milestones/:mid` | Update / change progress | M | 1 |
| DELETE | `/workspaces/:wid/goals/:id/milestones/:mid` | Remove | M | 1 |

> Goal progress = weighted milestone progress, with milestone progress derived from linked tasks when present.

### 4.8 Teacher Workspace

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET/POST | `/workspaces/:wid/subjects` | List / create | V / M | 2 |
| PATCH/DELETE | `/workspaces/:wid/subjects/:id` | Update / delete | M | 2 |
| GET/POST | `/workspaces/:wid/classes` | List / create class (e.g., Grade 8 - Rizal) | V / M | 2 |
| GET/PATCH/DELETE | `/workspaces/:wid/classes/:id` | Detail / update / delete | V / M / M | 2 |
| GET | `/workspaces/:wid/classes/today` | Today's classes (for Classes widget) | V | 2 |
| GET/POST | `/workspaces/:wid/students` | List (`classId, q`) / create | V / M | 2 |
| POST | `/workspaces/:wid/students/import` | CSV import | M | 2 |
| GET/PATCH/DELETE | `/workspaces/:wid/students/:id` | Student card (attendance, avg, trend, status) | V / M / M | 2 |
| PUT | `/workspaces/:wid/classes/:id/students` | Set enrollment `{studentIds[]}` | M | 2 |
| GET | `/workspaces/:wid/classes/:id/attendance` | `?from=&to=` | V | 2 |
| PUT | `/workspaces/:wid/classes/:id/attendance` | Bulk upsert for a date `{date, records:[{studentId,status}]}` | M | 2 |
| GET/POST | `/workspaces/:wid/classes/:id/assessments` | List / create assessment | V / M | 2 |
| PATCH/DELETE | `/workspaces/:wid/assessments/:id` | Update / delete | M | 2 |
| GET | `/workspaces/:wid/assessments/:id/grades` | Gradebook for assessment | V | 2 |
| PUT | `/workspaces/:wid/assessments/:id/grades` | Bulk upsert scores | M | 2 |
| GET | `/workspaces/:wid/classes/:id/gradebook` | Matrix students × assessments with averages | V | 2 |
| GET | `/workspaces/:wid/classes/:id/progress` | Per-student trend: Improving / Consistent / Needs attention / Significant decline | V | 2 |
| GET | `/workspaces/:wid/classes/:id/summary` | Class average, pending grades | V | 2 |

**Lesson Plan Manager**

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/lesson-plans` | List; `subject, gradeLevel, quarter, status, q` | V | 2 |
| POST | `/workspaces/:wid/lesson-plans` | Create (optionally `templateId`) | M | 2 |
| GET | `/workspaces/:wid/lesson-plans/:id` | Detail with attachments | V | 2 |
| PATCH | `/workspaces/:wid/lesson-plans/:id` | Update (autosave) | M | 2 |
| POST | `/workspaces/:wid/lesson-plans/:id/duplicate` | Duplicate / reuse `{planned_date?, copyAttachments?}` | M | 2 |
| DELETE | `/workspaces/:wid/lesson-plans/:id` | Soft delete | M | 2 |
| GET | `/lesson-plan-templates` | System templates (Lecture-based, Activity-based, Discussion, Laboratory, Group work, Assessment day) | auth | 2 |
| GET/POST | `/workspaces/:wid/lesson-plan-templates` | Custom templates | V / M | 3 |

### 4.9 Student Workspace

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/assignments` | List; `status, subjectId, group=today\|week\|later` | V | 2 |
| POST | `/workspaces/:wid/assignments` | Create `{subject, title, deadline, priority, estimated_minutes}` | M | 2 |
| GET | `/workspaces/:wid/assignments/:id` | Detail | V | 2 |
| PATCH | `/workspaces/:wid/assignments/:id` | Update / change status | M | 2 |
| DELETE | `/workspaces/:wid/assignments/:id` | Delete | M | 2 |
| GET | `/workspaces/:wid/assignments/workload` | `{totalMinutes, byGroup, biggest}` (e.g., 8.5 h, largest 5 h project) | V | 2 |
| GET | `/workspaces/:wid/deadlines` | Upcoming deadlines across assignments, tasks, events | V | 2 |
| POST | `/workspaces/:wid/focus/sessions` | Start session (requires opt-in) | M | 3 |
| PATCH | `/workspaces/:wid/focus/sessions/:id` | Stop / update | M | 3 |
| GET | `/workspaces/:wid/focus/summary` | `?range=day\|week` productive, break, distracting, focus ratio | V | 3 |
| PUT | `/workspaces/:wid/focus/consent` | Opt in / out `{enabled}` | O | 3 |
| DELETE | `/workspaces/:wid/focus/data` | Delete all focus data | O | 3 |

### 4.10 Documents

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| POST | `/workspaces/:wid/documents/upload-url` | Get signed upload URL `{name, mime, size, entityType?, entityId?}` | M | 3 |
| POST | `/workspaces/:wid/documents` | Register uploaded file metadata | M | 3 |
| GET | `/workspaces/:wid/documents` | List; `entityType, entityId, q` | V | 3 |
| GET | `/workspaces/:wid/documents/:id/download-url` | Short-lived signed URL | V | 3 |
| PATCH | `/workspaces/:wid/documents/:id` | Rename / re-attach | M | 3 |
| DELETE | `/workspaces/:wid/documents/:id` | Delete file | M | 3 |

### 4.11 Business and Finance

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET/POST | `/workspaces/:wid/products` | List (`lowStock=true`) / create | V / M | 4 |
| GET/PATCH/DELETE | `/workspaces/:wid/products/:id` | Detail / update / archive | V / M / M | 4 |
| POST | `/workspaces/:wid/products/:id/stock` | Adjust stock `{change, reason}` | M | 4 |
| GET | `/workspaces/:wid/products/low-stock` | Items at or below reorder level | V | 4 |
| GET/POST | `/workspaces/:wid/customers` | List / create | V / M | 4 |
| GET/PATCH/DELETE | `/workspaces/:wid/customers/:id` | Detail / update / delete | V / M / M | 4 |
| GET/POST | `/workspaces/:wid/orders` | List / record order or quick sale (decrements stock) | V / M | 4 |
| GET/PATCH | `/workspaces/:wid/orders/:id` | Detail / update status | V / M | 4 |
| GET | `/workspaces/:wid/sales/summary` | `?from=&to=&compare=previous` sales, orders, profit, comparison | V | 4 |
| GET | `/workspaces/:wid/sales/top-products` | Most profitable products | V | 4 |
| GET/POST | `/workspaces/:wid/transaction-categories` | Categories | V / M | 4 |
| GET/POST | `/workspaces/:wid/transactions` | Income / expense / savings | V / M | 4 |
| PATCH/DELETE | `/workspaces/:wid/transactions/:id` | Update / delete | M | 4 |
| GET | `/workspaces/:wid/finance/summary` | Income, expenses, savings, by category | V | 4 |

### 4.12 Custom Trackers

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET/POST | `/workspaces/:wid/trackers` | List / create definition `{name, fields[]}` | V / M | 4 |
| GET/PATCH/DELETE | `/workspaces/:wid/trackers/:id` | Definition detail / update / delete | V / M / M | 4 |
| GET | `/workspaces/:wid/trackers/:id/records` | List with field filters, sort, aggregate | V | 4 |
| POST | `/workspaces/:wid/trackers/:id/records` | Create (validated against field schema) | M | 4 |
| PATCH/DELETE | `/workspaces/:wid/trackers/:id/records/:rid` | Update / delete | M | 4 |
| GET | `/workspaces/:wid/trackers/:id/aggregate` | Sum / avg / count / group-by for widgets | V | 4 |

### 4.13 General Modules (Habits, Time, Reminders, Bookmarks, Contacts)

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET/POST | `/workspaces/:wid/habits` | List / create | V / M | 4 |
| POST | `/workspaces/:wid/habits/:id/log` | Log completion `{date, count}` | M | 4 |
| GET | `/workspaces/:wid/habits/:id/stats` | Streaks | V | 4 |
| GET | `/workspaces/:wid/time-entries` | List | V | 4 |
| POST | `/workspaces/:wid/time-entries/start` / `/stop` | Timer | M | 4 |
| GET/POST | `/workspaces/:wid/bookmarks`, `/contacts`, `/reminders` | Lightweight CRUD modules (implemented as built-in trackers or dedicated tables) | V / M | 4 |

### 4.14 Analytics and Feedback

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/workspaces/:wid/analytics/summary` | Tasks completed/remaining, completion rate, focus time, most productive day, top category | V | 1 (basic) / 5 |
| GET | `/workspaces/:wid/analytics/weekly` | `?weekStart=` weekly report | V | 1 (basic) / 5 |
| GET | `/workspaces/:wid/analytics/feedback` | Progress-based feedback messages (empty when nothing meaningful) | V | 2 |
| GET | `/workspaces/:wid/analytics/trends` | Time series for charts | V | 5 |

### 4.15 Notifications, Billing, AI

| Method | Route | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/notifications` | List for current user | auth | 3 |
| PATCH | `/notifications/:id/read` | Mark read | auth | 3 |
| POST | `/notifications/read-all` | Mark all read | auth | 3 |
| GET | `/billing/plan` | Current tier + entitlements + usage | auth | 3 |
| POST | `/billing/checkout` | Start upgrade (provider TBD) | auth | 5 |
| POST | `/billing/webhook` | Payment provider webhook | public (signed) | 5 |
| POST | `/ai/lesson-plan` | Generate lesson plan draft | M | 6 |
| POST | `/ai/organize-assignments` | Suggest ordering | M | 6 |
| POST | `/ai/summarize-tasks` | Weekly task summary | M | 6 |
| POST | `/ai/business-insights` | Product profitability insights | M | 6 |

---

## 5. Example Payloads

### 5.1 Create Workspace from Template

**Request**
```http
POST /api/v1/workspaces
Content-Type: application/json
Authorization: Bearer <supabase_access_token>

{
  "name": "School Workspace",
  "template": "teacher",
  "icon": "school",
  "color": "#2563eb"
}
```

**Response**
```json
{
  "data": {
    "id": "6f1c...",
    "name": "School Workspace",
    "template": "teacher",
    "modules": ["tasks","notes","calendar","goals","classes","students","grades","lesson_plans"],
    "dashboardWidgetCount": 6
  }
}
```

### 5.2 Save Dashboard Layout

**Request**
```http
PUT /api/v1/workspaces/:wid/dashboard/layout
Content-Type: application/json
Authorization: Bearer <supabase_access_token>

{
  "widgets": [
    { "id": "a1..", "x": 0, "y": 0, "w": 6, "h": 3, "zone": "main", "position": 0 },
    { "id": "b2..", "x": 6, "y": 0, "w": 6, "h": 3, "zone": "main", "position": 1 }
  ]
}
```

**Response**
```json
{
  "data": {
    "widgets": [
      { "id": "a1..", "x": 0, "y": 0, "w": 6, "h": 3, "zone": "main", "position": 0 },
      { "id": "b2..", "x": 6, "y": 0, "w": 6, "h": 3, "zone": "main", "position": 1 }
    ]
  }
}
```

### 5.3 Student Workload

**Request**
```http
GET /api/v1/workspaces/:wid/assignments/workload
Authorization: Bearer <supabase_access_token>
```

**Response**
```json
{
  "data": {
    "totalMinutes": 510,
    "totalHours": 8.5,
    "groups": {
      "today":  { "count": 1, "minutes": 60 },
      "week":   { "count": 2, "minutes": 390 },
      "later":  { "count": 1, "minutes": 60 }
    },
    "biggest": {
      "id": "c3..",
      "title": "Science project",
      "minutes": 300
    }
  }
}
```

### 5.4 Student Card with Trend

**Request**
```http
GET /api/v1/workspaces/:wid/students/:id
Authorization: Bearer <supabase_access_token>
```

**Response**
```json
{
  "data": {
    "id": "d4..",
    "name": "Student C",
    "attendanceRate": 82,
    "averageGrade": 76,
    "trend": "needs_attention",
    "label": "Needs attention"
  }
}
```

### 5.5 Create Task

**Request**
```http
POST /api/v1/workspaces/:wid/tasks
Content-Type: application/json
Authorization: Bearer <supabase_access_token>

{
  "title": "Complete lesson plan for Monday",
  "description": "Focus on quadratic equations",
  "priority": "high",
  "dueAt": "2026-10-07T17:00:00Z",
  "estimatedMinutes": 60,
  "projectId": "p1.."
}
```

**Response**
```json
{
  "data": {
    "id": "t1..",
    "title": "Complete lesson plan for Monday",
    "description": "Focus on quadratic equations",
    "status": "todo",
    "priority": "high",
    "dueAt": "2026-10-07T17:00:00Z",
    "estimatedMinutes": 60,
    "createdAt": "2026-10-05T10:00:00Z"
  }
}
```

### 5.6 Bulk Grade Entry

**Request**
```http
PUT /api/v1/workspaces/:wid/assessments/:id/grades
Content-Type: application/json
Authorization: Bearer <supabase_access_token>

{
  "grades": [
    { "studentId": "s1..", "score": 85 },
    { "studentId": "s2..", "score": 92 },
    { "studentId": "s3..", "score": 78 }
  ]
}
```

**Response**
```json
{
  "data": {
    "assessmentId": "a1..",
    "grades": [
      { "studentId": "s1..", "score": 85 },
      { "studentId": "s2..", "score": 92 },
      { "studentId": "s3..", "score": 78 }
    ]
  }
}
```

### 5.7 Duplicate Lesson Plan

**Request**
```http
POST /api/v1/workspaces/:wid/lesson-plans/:id/duplicate
Content-Type: application/json
Authorization: Bearer <supabase_access_token>

{
  "plannedDate": "2026-10-12",
  "copyAttachments": true
}
```

**Response**
```json
{
  "data": {
    "id": "lp2..",
    "sourcePlanId": "lp1..",
    "topic": "Quadratic Equations",
    "plannedDate": "2026-10-12",
    "status": "draft"
  }
}
```

---

## 6. API Documentation

### 6.1 Swagger UI

- Swagger UI available at `/api/docs`
- Interactive API documentation
- Try out endpoints directly from the browser
- View request/response schemas

### 6.2 OpenAPI Specification

- OpenAPI JSON available at `/api/docs-json`
- Can be used to generate client SDKs
- Version controlled with the codebase

### 6.3 API Versioning

- Current version: `/api/v1`
- Future versions: `/api/v2`, etc.
- Backward compatibility maintained for at least one major version

---

*End of API Plan*
