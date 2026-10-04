# Talibon Workspace — Tasks Plan

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

1. [Overall Roadmap](#1-overall-roadmap)
2. [Phase 0 — Foundation](#2-phase-0---foundation)
3. [Phase 1 — Core Platform](#3-phase-1---core-platform)
4. [Phase 2 — Teacher and Student MVP](#4-phase-2---teacher-and-student-mvp)
5. [Phase 3 — Documents, Focus Tracker, Notifications, Gating](#5-phase-3---documents-focus-tracker-notifications-gating)
6. [Phase 4 — Finance, Business and Custom Trackers](#6-phase-4---finance-business-and-custom-trackers)
7. [Phase 5 — Advanced Analytics, School Package, Integrations](#7-phase-5---advanced-analytics-school-package-integrations)
8. [Phase 6 — AI Assistant (Optional)](#8-phase-6---ai-assistant-optional)
9. [Definition of Done](#9-definition-of-done)
10. [Suggested First Sprint](#10-suggested-first-sprint)

---

## 1. Overall Roadmap

### 1.1 Phase Overview

| Phase | Focus | Est. duration | Exit criteria |
|---|---|---|---|
| 0 | Foundation and setup | 1 week | Repos, CI, environments, base schema deployed |
| 1 | Core platform: widget system, tasks, notes, calendar, goals | 5–6 weeks | A user can sign up, create a workspace, customize a dashboard and use core modules |
| 2 | Teacher and Student MVP | 5–6 weeks | Teachers manage classes/grades/lesson plans; students manage assignments and workload; pilot-ready |
| 3 | Documents, focus tracker, notifications, plan gating | 3–4 weeks | Files attach to entities; opt-in focus tracking works; free tier limits enforced |
| 4 | Finance, business workspaces, custom trackers, general modules | 5–6 weeks | Sari-sari store scenario works end to end |
| 5 | Advanced analytics, school package, Intra-Office integration, billing | 5–6 weeks | Institution licensing and org membership functional |
| 6 | AI assistant and automation | 3–4 weeks | Optional AI features behind flag |

### 1.2 MVP Milestone

**MVP milestone = end of Phase 2** (≈ 12–14 weeks)

Pilot with a small group of teachers and students in a partner school.

### 1.3 Time Estimates

Time estimates assume 1–2 developers and are rough planning figures to be refined after Phase 0.

---

## 2. Phase 0 — Foundation

**Duration**: 1 week

**Goal**: Set up development environment, CI/CD, and base infrastructure.

### 2.1 Checklist

- [ ] Create monorepo (pnpm workspaces), ESLint, Prettier, Husky, commit lint
- [ ] Scaffold `apps/api` (NestJS) with config validation, Pino, Swagger, Helmet, CORS, Throttler
- [ ] Scaffold `apps/web` (Vite + React + TS + Tailwind + React Router + TanStack Query + Zustand)
- [ ] Create Supabase projects (dev, staging, prod); configure Auth providers and Storage buckets
- [ ] Prisma setup, initial migration (profiles, workspaces, members, catalogs)
- [ ] Seed script: module catalog, widget catalog, role templates
- [ ] Implement `JwtAuthGuard`, `WorkspaceGuard`, `RolesGuard`, error filter, response interceptor
- [ ] CI pipelines for both apps; staging deploy
- [ ] Write `README`, contribution guide, `.env.example` files
- [ ] Design tokens and base UI components (Button, Input, Card, Modal, Drawer, Toast, EmptyState)

### 2.2 Deliverables

- Working monorepo with both apps scaffolds
- Supabase projects configured
- Base database schema deployed
- CI/CD pipelines running
- Base UI component library
- Documentation in place

---

## 3. Phase 1 — Core Platform

**Duration**: 5–6 weeks

**Goal**: Users can sign up, create workspaces, customize dashboards, and use core productivity modules.

### 3.1 Auth and Workspaces

**Backend**
- [ ] `/me` endpoint with profile lazy-create
- [ ] Onboarding endpoint to save primary role and create first workspace
- [ ] Workspace CRUD endpoints
- [ ] Template apply in transaction
- [ ] Membership management endpoints

**Frontend**
- [ ] Login, register, password reset pages
- [ ] Session handling and route guards
- [ ] Onboarding role picker
- [ ] Template preview component
- [ ] Workspace switcher (one tap)
- [ ] Create workspace dialog
- [ ] Workspace settings page

### 3.2 Modules and Dashboard (Workspace Builder)

**Backend**
- [ ] Module catalog endpoint
- [ ] Per-workspace module enablement endpoints
- [ ] Dashboard settings endpoints
- [ ] Widget CRUD endpoints
- [ ] Bulk layout save endpoint
- [ ] Aggregated `/dashboard/data` endpoint

**Frontend**
- [ ] Dashboard canvas with `react-grid-layout`
- [ ] Edit mode toggle
- [ ] Widget resize and drag
- [ ] "Customize Workspace" drawer with tabs:
  - Modules (toggle on/off)
  - Widgets (add from catalog)
  - Priority (choose what matters most)
- [ ] Widget registry implementation
- [ ] First widgets: tasks, calendar today, notes, goals, progress
- [ ] Priority setting reorders dashboard (desktop and mobile)

### 3.3 Tasks

**Backend**
- [ ] Tasks CRUD endpoints
- [ ] Complete endpoint (sets `completed_at`)
- [ ] Reorder endpoint (bulk)
- [ ] Summary endpoint (done, total, overdue, dueToday)
- [ ] Filters: status, priority, projectId, goalId, due_from, due_to, assigneeId, q

**Frontend**
- [ ] Task list page
- [ ] Quick add task dialog
- [ ] Optimistic toggle for task completion
- [ ] Task widget for dashboard
- [ ] Task detail view
- [ ] Task edit form

### 3.4 Notes

**Backend**
- [ ] Notes CRUD endpoints
- [ ] Note categories CRUD
- [ ] Search endpoint (trigram)

**Frontend**
- [ ] Notes by context (category tree)
- [ ] TipTap editor with autosave
- [ ] Notes widget
- [ ] Note detail view
- [ ] Category management

### 3.5 Calendar

**Backend**
- [ ] Events CRUD endpoints
- [ ] Range query endpoint (expands recurrence)
- [ ] Today agenda endpoint (events + due tasks)

**Frontend**
- [ ] Month/week/day views
- [ ] Create/edit event dialog
- [ ] Calendar widget
- [ ] Recurrence support (basic)

### 3.6 Goals

**Backend**
- [ ] Goals CRUD endpoints
- [ ] Milestones CRUD endpoints
- [ ] Computed progress endpoint
- [ ] Link tasks to goals/milestones

**Frontend**
- [ ] Goal page with milestone breakdown
- [ ] Goal widget
- [ ] Milestone progress bars
- [ ] Link tasks to goals

### 3.7 Basic Analytics

**Backend**
- [ ] Summary endpoint (completed/remaining, completion rate)
- [ ] Weekly endpoint (basic metrics)

**Frontend**
- [ ] Progress widget
- [ ] Basic weekly report page
- [ ] Simple charts using Recharts

### 3.8 Quality

- [ ] Workspace isolation e2e tests
- [ ] Unit tests for services (workload, trends, feedback)
- [ ] Empty states for all pages and widgets
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Responsive design pass (mobile, tablet, desktop)

---

## 4. Phase 2 — Teacher and Student MVP

**Duration**: 5–6 weeks

**Goal**: Teachers can manage classes, grades, and lesson plans; students can manage assignments and workload. Pilot-ready.

### 4.1 Teacher

**Backend**
- [ ] Subjects CRUD endpoints
- [ ] Classes CRUD endpoints with schedule
- [ ] `classes/today` endpoint
- [ ] Students CRUD endpoints
- [ ] CSV import endpoint
- [ ] Class enrollment endpoint
- [ ] Attendance CRUD endpoints (bulk per date)
- [ ] Assessments CRUD endpoints
- [ ] Grade entry endpoints (bulk)
- [ ] Gradebook matrix endpoint
- [ ] Class summary endpoint
- [ ] Student progress calculator service
- [ ] Trend indicator service (Improving / Consistent / Needs attention / Significant decline)
- [ ] Lesson plans CRUD endpoints
- [ ] Lesson plan duplicate endpoint
- [ ] System lesson plan templates seed
- [ ] Custom lesson plan templates CRUD

**Frontend**
- [ ] Subjects management page
- [ ] Classes management page with schedule editor
- [ ] Students management page with CSV import
- [ ] Class enrollment UI
- [ ] Attendance tracking UI (bulk per date)
- [ ] Assessments management page
- [ ] Grade entry UI (bulk)
- [ ] Gradebook matrix view
- [ ] Student card with attendance, average, trend badge
- [ ] "Add follow-up task" action on student card
- [ ] Lesson plan manager with structured form
- [ ] Autosave for lesson plans
- [ ] Lesson plan template picker
- [ ] Duplicate/edit/reuse lesson plans
- [ ] Teacher dashboard widgets:
  - Classes today
  - Pending grades
  - Lesson plans this week
  - Class average
  - Students needing attention
- [ ] Seed Teacher template
- [ ] Verify "Monday" scenario end to end

### 4.2 Student

**Backend**
- [ ] Subjects CRUD endpoints
- [ ] Assignments CRUD endpoints
- [ ] Auto grouping service (Today / This week / Later)
- [ ] Workload endpoint (totalMinutes, byGroup, biggest)
- [ ] Deadlines endpoint (upcoming across assignments, tasks, events)

**Frontend**
- [ ] Subjects management page
- [ ] Assignment Manager page
- [ ] Quick add assignment dialog
- [ ] Assignment detail view
- [ ] Workload widget (hours breakdown)
- [ ] Deadlines list
- [ ] Weekly goal widget (tied to goals module)
- [ ] Seed Student template
- [ ] Verify "plans the week" scenario

### 4.3 Feedback

**Backend**
- [ ] Progress-based feedback generator service (only when backed by real change)

**Frontend**
- [ ] Feedback surface in dashboard
- [ ] Feedback message component

### 4.4 Pilot Readiness

- [ ] Onboarding checklist
- [ ] In-app help documentation
- [ ] Feedback button
- [ ] Data privacy notice
- [ ] Consent text for pilot schools
- [ ] Performance check on low-bandwidth devices
- [ ] Pilot with small group of teachers and students
- [ ] Collect feedback loop

---

## 5. Phase 3 — Documents, Focus Tracker, Notifications, Gating

**Duration**: 3–4 weeks

**Goal**: File attachments, opt-in focus tracking, notifications, and plan gating.

### 5.1 Documents

**Backend**
- [ ] Signed upload URL endpoint
- [ ] File metadata registration endpoint
- [ ] Documents list endpoint (with filters)
- [ ] Download URL endpoint (short-lived signed)
- [ ] Rename/re-attach endpoint
- [ ] Delete endpoint

**Frontend**
- [ ] Document panel on lesson plan and other entities
- [ ] Document workspace page
- [ ] File picker with progress
- [ ] Document preview

### 5.2 Focus Tracker

**Backend**
- [ ] Consent flow endpoint
- [ ] Focus sessions CRUD endpoints
- [ ] Summary endpoint (productive, break, distracting, focus ratio)
- [ ] Delete-my-data endpoint

**Frontend**
- [ ] Consent flow UI
- [ ] Focus session UI (start/stop)
- [ ] Focus summary page
- [ ] Delete data action

### 5.3 Notifications

**Backend**
- [ ] Notifications list endpoint
- [ ] Mark read endpoint
- [ ] Mark all read endpoint
- [ ] Scheduled job for deadline/event reminders

**Frontend**
- [ ] In-app notification list
- [ ] Notification bell with badge
- [ ] Notification detail view

### 5.4 Plan Gating

**Backend**
- [ ] `FeatureGuard` implementation
- [ ] Free-tier limits enforcement (1 workspace, limited widgets)
- [ ] Plan entitlements endpoint
- [ ] Upgrade prompts logic

**Frontend**
- [ ] Upgrade prompts in UI
- [ ] Plan indicator in settings
- [ ] Feature lock indicators

### 5.5 Offline Drafts

**Backend**
- [ ] Sync endpoint for queued drafts

**Frontend**
- [ ] Persist notes/lesson plans/tasks locally
- [ ] Sync on reconnect
- [ ] Draft indicator

### 5.6 Additional Features

- [ ] Custom lesson plan templates
- [ ] Workspace duplicate

---

## 6. Phase 4 — Finance, Business and Custom Trackers

**Duration**: 5–6 weeks

**Goal**: Business workspaces with inventory, sales, finance, and custom trackers.

### 6.1 Products and Inventory

**Backend**
- [ ] Products CRUD endpoints
- [ ] Stock movements endpoint
- [ ] Low-stock alert endpoint
- [ ] Stock adjustment logic

**Frontend**
- [ ] Products management page
- [ ] Stock adjustment UI
- [ ] Low-stock widget
- [ ] Inventory dashboard widgets

### 6.2 Customers and Orders

**Backend**
- [ ] Customers CRUD endpoints
- [ ] Orders CRUD endpoints
- [ ] Quick sale endpoint (decrements stock)
- [ ] Sales summary endpoint with period comparison
- [ ] Top products endpoint
- [ ] Profit calculation logic

**Frontend**
- [ ] Customers management page
- [ ] Orders management page
- [ ] Quick sale dialog
- [ ] Sales summary page
- [ ] Business dashboard widgets:
  - Sales today
  - Profit
  - Low stock
  - Customers
  - Tasks

### 6.3 Personal Finance

**Backend**
- [ ] Transaction categories CRUD endpoints
- [ ] Transactions CRUD endpoints
- [ ] Finance summary endpoint

**Frontend**
- [ ] Categories management page
- [ ] Transactions page
- [ ] Finance summary page
- [ ] Finance widget

### 6.4 Custom Trackers

**Backend**
- [ ] Tracker definition CRUD endpoints
- [ ] Tracker records CRUD endpoints
- [ ] Aggregate endpoint (sum/avg/count/group-by)
- [ ] Field validation logic

**Frontend**
- [ ] Tracker builder UI (field types: text, number, date, select, checkbox, currency)
- [ ] Tracker records table
- [ ] Tracker widgets (table, chart)
- [ ] Aggregate configuration UI

### 6.5 General Modules

- [ ] Habits tracker
- [ ] Time tracker
- [ ] Reminders
- [ ] Bookmarks
- [ ] Contacts
- [ ] Projects

### 6.6 Business Template

- [ ] Seed Business template
- [ ] Verify "sari-sari store" scenario end to end

---

## 7. Phase 5 — Advanced Analytics, School Package, Integrations

**Duration**: 5–6 weeks

**Goal**: Advanced analytics, institution licensing, and integrations.

### 7.1 Advanced Analytics

**Backend**
- [ ] Trends endpoint (time series for charts)
- [ ] Most productive day calculation
- [ ] Workload category analysis
- [ ] Weekly report generation job
- [ ] Trend indicator refinement

**Frontend**
- [ ] Advanced analytics page
- [ ] Trend charts
- [ ] Workload category breakdown
- [ ] Most productive day widget

### 7.2 Members and Invitations

**Backend**
- [ ] Members list endpoint
- [ ] Invite by email endpoint
- [ ] Accept invitation endpoint
- [ ] Change role endpoint
- [ ] Remove member endpoint

**Frontend**
- [ ] Members management page
- [ ] Invite dialog
- [ ] Role management UI

### 7.3 Education Package

**Backend**
- [ ] Institution licensing endpoints
- [ ] Bulk provisioning of Teacher + Student workspaces
- [ ] Organization-level settings

**Frontend**
- [ ] Institution admin console
- [ ] Bulk provisioning UI
- [ ] Organization settings

### 7.4 Organization Package

**Backend**
- [ ] Per-user subscription endpoints
- [ ] Bundle with Intra-Office logic
- [ ] Organization link endpoints

**Frontend**
- [ ] Organization management page
- [ ] Subscription management UI

### 7.5 Intra-Office Integration

**Backend**
- [ ] SSO/shared accounts endpoints
- [ ] Organization link endpoint
- [ ] Announcements into dashboard endpoint

**Frontend**
- [ ] SSO login flow
- [ ] Organization settings
- [ ] Announcements widget

### 7.6 Billing

**Backend**
- [ ] Billing provider integration (checkout, webhooks, invoices)
- [ ] Plan management endpoints
- [ ] Subscription endpoints
- [ ] Invoice generation

**Frontend**
- [ ] Checkout flow
- [ ] Plan comparison page
- [ ] Invoice history
- [ ] Payment method management

### 7.7 Audit Log

**Backend**
- [ ] Audit log table
- [ ] Audit log endpoints
- [ ] Admin console endpoints

**Frontend**
- [ ] Admin console UI
- [ ] Audit log viewer

---

## 8. Phase 6 — AI Assistant (Optional)

**Duration**: 3–4 weeks

**Goal**: Optional AI features behind feature flags.

### 8.1 AI Service Abstraction

**Backend**
- [ ] AI service abstraction (provider-agnostic)
- [ ] Prompt templates
- [ ] Rate limits
- [ ] Cost tracking

### 8.2 AI Features

**Backend**
- [ ] Lesson plan draft generation endpoint
- [ ] Assignment organizer endpoint
- [ ] Task summary endpoint
- [ ] Business insights endpoint

**Frontend**
- [ ] AI assistant UI
- [ ] Lesson plan AI generation
- [ ] Assignment organization suggestions
- [ ] Task summary generation
- [ ] Business insights panel

### 8.3 Safety and Privacy

- [ ] Feature flag implementation
- [ ] Opt-in flow
- [ ] Human review before saving
- [ ] Clear labeling of AI content
- [ ] Privacy review (no student PII sent without consent)

---

## 9. Definition of Done (Per Feature)

### 9.1 Backend

- [ ] API endpoint documented in Swagger
- [ ] DTO validated with whitelist mode
- [ ] Role guard applied
- [ ] Workspace guard applied
- [ ] Unit tests for business logic
- [ ] E2E test including cross-workspace denial
- [ ] Migration included and reversible/safe
- [ ] Seeds updated if catalogs changed
- [ ] No unscoped queries
- [ ] No secrets in code

### 9.2 Frontend

- [ ] Loading state for all async operations
- [ ] Empty state for all lists
- [ ] Error state with helpful messages
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Keyboard accessible
- [ ] Component tests for critical paths
- [ ] E2E test for user flows

### 9.3 Quality

- [ ] Reviewed and merged with green CI
- [ ] Deployed to staging and smoke tested
- [ ] Performance metrics within targets
- [ ] Accessibility check passed

---

## 10. Suggested First Sprint (Week 1–2)

### 10.1 Sprint Goals

1. Monorepo + CI + both scaffolds running locally
2. Supabase projects, auth working in the web app, `/me` returning a profile from the API
3. Workspace create with Teacher/Student/Custom templates, dashboard rendering static seeded widgets
4. Tasks CRUD end to end (first vertical slice proving the architecture)

### 10.2 Sprint Tasks

**Week 1**
- Day 1-2: Monorepo setup, CI pipelines, Supabase projects
- Day 3-4: API scaffold, Prisma setup, base schema
- Day 5: Web scaffold, auth integration, `/me` endpoint

**Week 2**
- Day 1-2: Workspace CRUD, template apply, seed data
- Day 3-4: Dashboard canvas, widget registry, static widgets
- Day 5: Tasks CRUD end to end, testing

### 10.3 Success Criteria

- [ ] Both apps run locally without errors
- [ ] CI pipelines pass on push
- [ ] User can sign up via Supabase
- [ ] `/me` returns profile data
- [ ] User can create workspace from template
- [ ] Dashboard renders with seeded widgets
- [ ] User can create, read, update, delete tasks
- [ ] Workspace isolation tested and verified

---

## 11. Risk Mitigation

### 11.1 Timeline Risks

**Risk**: Phases take longer than estimated
**Mitigation**:
- Re-estimate after Phase 0
- Adjust scope based on velocity
- Prioritize MVP features first
- Defer non-critical features to later phases

### 11.2 Technical Risks

**Risk**: Integration issues with Supabase
**Mitigation**:
- Use Supabase early in Phase 0
- Test all integrations thoroughly
- Have fallback plans for auth/storage
- Monitor Supabase uptime and performance

### 11.3 User Adoption Risks

**Risk**: Pilot users find the platform difficult to use
**Mitigation**:
- Extensive onboarding flow
- In-app help and documentation
- Feedback button and prompt support
- Iterate based on pilot feedback

### 11.4 Performance Risks

**Risk**: Dashboard load time exceeds target
**Mitigation**:
- Aggregated `/dashboard/data` endpoint
- Code splitting and lazy loading
- Optimistic updates
- Caching strategy
- Performance monitoring

---

## 12. Metrics and KPIs

### 12.1 Development Metrics

- Velocity (story points per sprint)
- Cycle time (feature start to deployment)
- Defect rate (bugs per feature)
- Test coverage percentage
- Build success rate

### 12.2 Product Metrics (Post-Launch)

- Registered users
- Workspaces created
- Weekly active users
- Widgets per workspace
- Tasks completed
- Lesson plans saved/reused
- Free→Premium conversion rate

### 12.3 Technical Metrics

- API response time (p95)
- Dashboard load time
- Error rate
- Uptime percentage
- Database query performance

---

*End of Tasks Plan*
