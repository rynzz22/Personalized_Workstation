# Talibon Workspace — Importance & Scope

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

1. [Project Vision](#1-project-vision)
2. [Core Ideas](#2-core-ideas)
3. [Position in Ecosystem](#3-position-in-ecosystem)
4. [Design Principles](#4-design-principles)
5. [MVP Scope](#5-mvp-scope)
6. [Post-MVP Scope](#6-post-mvp-scope)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Project Vision

Talibon Workspace is a customizable digital platform where each user builds a dashboard around their role, goals and responsibilities. A teacher, student, employee, freelancer or small business owner uses the same platform and sees completely different things.

It is **not** a teacher app or a student app. It is a system made of **modules** (functional blocks) and **widgets** (visual pieces on the dashboard) that users add, arrange and resize.

### 1.1 Why This Matters

Traditional productivity tools are one-size-fits-all. A teacher needs to manage classes, grades, and lesson plans. A student needs to track assignments and workload. A business owner needs inventory, sales, and finance. Trying to build separate apps for each role is inefficient and creates fragmentation.

Talibon Workspace solves this by providing:
- **Role-aware starting points**: Templates that pre-configure the dashboard for specific roles
- **Modular architecture**: Users enable only the modules they need
- **Widget-based customization**: Users arrange their dashboard to match their workflow
- **Workspace context**: Multiple workspaces for different aspects of life (School, Personal, Business)

### 1.2 Target Users

**Primary Users (MVP)**
- Teachers: Manage classes, students, grades, lesson plans
- Students: Track assignments, deadlines, workload, study goals

**Secondary Users (Post-MVP)**
- Employees: Task management, project tracking
- Freelancers: Client management, time tracking, invoicing
- Small business owners: Inventory, sales, finance
- Personal users: Habits, goals, personal finance

---

## 2. Core Ideas

| Idea | Meaning | Importance |
|---|---|---|
| Role-aware starting point | Templates: Teacher, Student, Employee, Freelancer, Business, Personal, Custom | Reduces onboarding friction; users see immediate value |
| Modules | Functional blocks: Tasks, Notes, Calendar, Goals, Students, Grades, Inventory, Sales, Finance... | Enables flexibility; users only pay for what they use |
| Widgets | Dashboard tiles of a module: add, move, resize | Gives users control over their workspace; customization is the product |
| Context | Multiple workspaces per user (School, Personal, Master's) | Separates concerns; users can have different dashboards for different contexts |

### 2.1 Module System

Modules are the building blocks of the platform. Each module provides:
- Core functionality (e.g., Tasks module provides task management)
- Widgets for the dashboard (e.g., Task List widget, Task Progress widget)
- API endpoints for data access
- Database schema for data persistence

**Core Modules (MVP)**
- Tasks: Task management, projects, priorities
- Notes: Rich text notes, categories, search
- Calendar: Events, reminders, recurrence
- Goals: Goals, milestones, progress tracking
- Education: Classes, students, grades, lesson plans, assignments

**Business Modules (Post-MVP)**
- Products: Inventory management
- Customers: Customer management
- Orders: Order management, sales tracking
- Finance: Income, expenses, savings

### 2.2 Widget System

Widgets are the visual representation of module data on the dashboard. Each widget:
- Displays specific data from a module
- Can be added, moved, resized, or removed
- Has configurable settings
- Responds to real-time data changes

**Widget Examples**
- Task List: Shows open tasks
- Calendar Today: Shows today's agenda
- Class Average: Shows class grade average
- Workload Hours: Shows estimated workload for students
- Sales Today: Shows today's sales and profit

---

## 3. Position in Ecosystem

### 3.1 Talibon Ecosystem

```
┌─────────────────────────────────────────────────────────┐
│                    Talibon Ecosystem                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐     ┌──────────────────┐         │
│  │  Talibon         │     │  Talibon         │         │
│  │  Workspace       │────▶│  Intra-Office    │         │
│  │  (Individual)    │     │  (Organization)  │         │
│  └──────────────────┘     └──────────────────┘         │
│                                                          │
│  ┌──────────────────┐                                   │
│  │  Bao Bao App     │                                   │
│  │  (Education)     │                                   │
│  └──────────────────┘                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Role of Workspace

Workspace is the **individual productivity layer**. It focuses on:
- Personal task management
- Individual goal tracking
- Personal dashboard customization
- Multi-context support (School, Personal, Business)

### 3.3 Relationship to Other Products

- **Talibon Intra-Office**: Covers organizational operations, team collaboration, and enterprise features. Workspace integrates with Intra-Office for organization-level features (SSO, shared accounts, announcements).
- **Bao Bao App**: Education-specific application. Workspace is broader and not limited to education or Talibon; it can serve any school, business, or individual.

### 3.4 Integration Strategy

Phase 5 will include:
- SSO/shared accounts with Intra-Office
- Organization link to connect workspaces to organizations
- Announcements from Intra-Office displayed in dashboard
- Education package for school licensing

---

## 4. Design Principles

### 4.1 Customization Plus Context

**Principle**: Customization is the product, not the task list.

**Implication**:
- Users should be able to shape their workspace to match their workflow
- Templates provide starting points, not rigid structures
- Priority setting determines what matters most to the user
- Dashboard layout is data, not code

### 4.2 Workspace-Scoped Everything

**Principle**: Every record belongs to exactly one workspace.

**Implication**:
- All database tables have `workspace_id` foreign key
- All API endpoints are workspace-scoped
- Authorization checks workspace membership
- Data isolation is enforced at multiple layers

### 4.3 Meaningful Numbers

**Principle**: Trends, workload hours, and progress-based feedback instead of raw counts.

**Implication**:
- Show "5 tasks, 2 overdue" instead of just "7 tasks"
- Show "8.5 hours of work this week" instead of "12 assignments"
- Show "Improving" trend with context instead of just "82% grade"
- Progress feedback only when backed by real change

### 4.4 Privacy First

**Principle**: Focus/screen-time tracking is strictly opt-in; collect only what is needed.

**Implication**:
- Focus tracking requires explicit consent
- Data minimization: collect only labels and durations
- No keystroke logging, screen capture, or browsing history
- Clear "delete my data" action
- Frame insights as awareness, not punishment

### 4.5 MVP First

**Principle**: Do not build everything at once; AI is optional and last.

**Implication**:
- Ship MVP scope only (Phases 1-2)
- Use feature flags to gate advanced features
- AI is Phase 6, optional and behind flags
- Prioritize core value over nice-to-have features

### 4.6 Lightweight and Offline-Tolerant

**Principle**: Works on slow or unstable internet; drafts saved locally.

**Implication**:
- Small bundles, code splitting
- Aggregated dashboard endpoint (single round trip)
- Offline drafts for notes, lesson plans, tasks
- Sync when connection restored
- Performance targets: dashboard load under 2.5s on 3G

---

## 5. MVP Scope

### 5.1 MVP Phases

**Phase 1: Core Platform (5-6 weeks)**
- Account, workspace creation, templates
- Dashboard, widget system
- Tasks, notes, calendar, goals
- Basic analytics

**Phase 2: Teacher and Student MVP (5-6 weeks)**
- Teacher: classes, students, grades, lesson plans
- Student: assignments, deadlines, workload
- Progress indicators and feedback

**MVP Milestone**: End of Phase 2 (≈ 12-14 weeks)

### 5.2 MVP Tracks

| Track | Contents |
|---|---|
| Core | Account, workspace creation, templates, dashboard, widget system, tasks, notes, calendar, goals, basic analytics |
| Teacher MVP | Classes, students, grades, lesson plans (with templates, duplicate/reuse) |
| Student MVP | Subjects, assignments, deadlines, study goals, workload estimate |

### 5.3 MVP Exit Criteria

A user can:
- Sign up and create a workspace from a template
- Customize their dashboard with widgets
- Use core modules (tasks, notes, calendar, goals)
- (Teacher) Manage classes, students, grades, lesson plans
- (Student) Track assignments, deadlines, and workload
- See progress indicators and feedback

### 5.4 Pilot Readiness

- Onboarding checklist completed
- In-app help and feedback button
- Data privacy notice and consent text
- Performance verified on low-bandwidth devices
- Pilot with small group of teachers and students

---

## 6. Post-MVP Scope

### 6.1 Phase 3: Documents, Focus Tracker, Notifications, Gating (3-4 weeks)

- Documents attached to entities (lesson plans, assignments, tasks)
- Opt-in focus/screen-time tracking
- In-app notifications
- Plan entitlements and free tier limits
- Offline drafts and sync
- Custom lesson plan templates
- Workspace duplicate

### 6.2 Phase 4: Finance, Business Workspaces, Custom Trackers (5-6 weeks)

- Products and inventory with stock movements
- Customers and orders
- Sales tracking and profit calculation
- Personal finance (income, expenses, savings)
- Custom tracker builder
- Habits, time tracker, reminders, bookmarks, contacts, projects
- Business template

### 6.3 Phase 5: Advanced Analytics, School Package, Integrations (5-6 weeks)

- Advanced analytics (trends, most productive day, workload category)
- Weekly report generation
- Members and invitations
- Education package (institution licensing, bulk provisioning)
- Organization package (per-user subscription, Intra-Office bundle)
- Intra-Office integration (SSO, shared accounts, announcements)
- Billing provider integration
- Audit log and admin console

### 6.4 Phase 6: AI Assistant (Optional) (3-4 weeks)

- AI service abstraction (provider-agnostic)
- Lesson plan draft generation
- Assignment organizer
- Task summaries
- Business insights
- Feature flag, opt-in, human review
- Privacy review

---

## 7. Functional Requirements

### 7.1 Summary Table

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| FR-1 | Users register/login, have one account with many workspaces | High | 1 |
| FR-2 | Create a workspace from a role template or blank (Custom) | High | 1 |
| FR-3 | Enable/disable modules per workspace | High | 1 |
| FR-4 | Dashboard with draggable, resizable widgets; priority setting reorders layout | High | 1 |
| FR-5 | Tasks, notes (grouped by context), calendar events, goals with milestones | High | 1 |
| FR-6 | Teacher: classes, students, attendance, grades, lesson plan manager with templates | High | 2 |
| FR-7 | Student: assignments sorted Today/This week/Later, workload in estimated hours | High | 2 |
| FR-8 | Progress indicators: Improving, Consistent, Needs attention, Significant decline | High | 2 |
| FR-9 | Progress-based feedback messages and weekly analytics report | Medium | 2 |
| FR-10 | Documents attached to the work they belong to (e.g., a lesson plan) | Medium | 3 |
| FR-11 | Finance, sales, inventory, customers, orders (Phase 4) | Low | 4 |
| FR-12 | Custom trackers with user-defined fields (Phase 4) | Low | 4 |
| FR-13 | Opt-in focus/screen-time tracking (Phase 3) | Low | 3 |
| FR-14 | Freemium tiers with feature gating (Free / Premium / Education / Organization) | Medium | 3 |

### 7.2 Core Requirements (FR-1 to FR-5)

**Authentication and Workspaces**
- Users can register/login via Supabase Auth (email/password, OAuth)
- Each user has one account with multiple workspaces
- Workspaces can be created from role templates or blank
- Templates pre-configure modules, widgets, and sample data
- Modules can be enabled/disabled per workspace

**Dashboard and Widgets**
- Dashboard displays widgets in a grid layout
- Widgets can be added, moved, resized, or removed
- Priority setting reorders dashboard layout
- Dashboard layout is persisted in the database
- Aggregated endpoint provides data for all widgets in one request

**Core Modules**
- Tasks: Create, read, update, delete, complete, reorder
- Notes: Rich text editor, categories, search
- Calendar: Events, recurrence, reminders, today's agenda
- Goals: Goals, milestones, progress calculation, link to tasks

### 7.3 Teacher Requirements (FR-6)

**Classes and Students**
- Create and manage classes with schedules
- Add and manage students
- CSV import for students
- Enroll students in classes
- Track attendance (bulk per date)

**Grades**
- Create assessments (quizzes, exams, activities)
- Enter grades (bulk)
- View gradebook matrix (students × assessments)
- Calculate class averages
- Track student progress with trend indicators

**Lesson Plans**
- Create lesson plans with structured form
- Use system templates (Lecture, Activity, Discussion, etc.)
- Create custom templates
- Duplicate/reuse lesson plans
- Attach documents to lesson plans
- Autosave functionality

### 7.4 Student Requirements (FR-7 to FR-9)

**Assignments**
- Create assignments with subject, title, deadline, priority, estimated time
- Auto-group assignments: Today, This week, Later
- View workload in estimated hours
- Flag largest item

**Progress Indicators**
- Trend indicators: Improving, Consistent, Needs attention, Significant decline
- Based on comparison of recent window with prior window
- Configurable thresholds

**Feedback**
- Progress-based feedback messages
- Only generated when backed by real change
- Displayed in dashboard

### 7.5 Post-MVP Requirements (FR-10 to FR-14)

**Documents (FR-10)**
- Upload files via signed URLs
- Attach documents to entities (lesson plans, assignments, tasks)
- Document workspace page
- Polymorphic attachments

**Business Tools (FR-11)**
- Products: inventory, stock movements, low-stock alerts
- Customers: customer management
- Orders: order management, sales tracking, profit calculation
- Finance: income, expenses, savings, categories

**Custom Trackers (FR-12)**
- Define custom tracker with user-defined fields
- Field types: text, number, date, select, checkbox, currency
- Create records validated against field schema
- Aggregate data (sum, avg, count, group-by)
- Tracker widgets (table, chart)

**Focus Tracking (FR-13)**
- Opt-in consent flow
- Track focus sessions (study, break, distraction)
- Summary with productive, break, distracting, focus ratio
- Delete my data action

**Freemium Tiers (FR-14)**
- Free: 1 workspace, basic modules, limited widgets
- Premium: unlimited workspaces, all modules, advanced analytics
- Education: institution licensing, bulk provisioning
- Organization: per-user subscription, Intra-Office bundle

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target | Measurement |
|---|---|---|
| Dashboard first load | Under 2.5s on 3G-class connections | Lighthouse CI |
| API response time (p95) | Under 300ms | APM monitoring |
| Widget data fetch | Under 500ms for aggregated endpoint | APM monitoring |

### 8.2 Availability

| Metric | Target | Measurement |
|---|---|---|
| Uptime | 99.5% for MVP | Uptime monitoring |
| Error rate | Under 0.1% | Error tracking |

### 8.3 Offline Support

| Feature | Requirement |
|---|---|
| Drafts | Notes, lesson plans, tasks saved locally |
| Sync | Queue and sync when connection restored |
| Indicators | Show offline status and pending sync |

### 8.4 Security

| Area | Requirement |
|---|---|
| Authentication | JWT auth via Supabase |
| Authorization | Workspace-scoped authorization |
| Transport | HTTPS only, HSTS |
| Input validation | DTO validation with whitelist |
| Database | RLS deny-all, backend role only |
| Files | Private buckets, signed URLs, short TTL |
| Secrets | Env vars only, service role key never in frontend |

### 8.5 Accessibility

| Standard | Target |
|---|---|
| WCAG | 2.1 AA for core flows |
| Keyboard navigation | All interactive elements accessible |
| Screen reader | Semantic HTML, ARIA labels |
| Color contrast | Minimum 4.5:1 for normal text |

### 8.6 Localization

| Aspect | Requirement |
|---|---|
| Primary language | English |
| Structure | i18n-ready |
| Next language | Filipino |
| Currency | PHP default (configurable per workspace) |

---

## 9. Success Metrics

### 9.1 Adoption Metrics

- Registered users
- Workspaces created
- Weekly active users
- Multi-workspace users

### 9.2 Engagement Metrics

- Widgets per workspace
- Tasks completed
- Lesson plans saved/reused
- Assignments completed

### 9.3 Retention Metrics

- Weekly return rate
- Monthly return rate
- Feature usage by cohort

### 9.4 Revenue Metrics

- Free→Premium conversion rate
- School/org contracts
- MRR (Monthly Recurring Revenue)

---

## 10. Risk Assessment

### 10.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase vendor lock-in | Medium | Medium | Prisma over standard Postgres; storage and auth behind thin adapters |
| Cross-tenant data leak | Low | High | Guards + scoped queries + RLS deny-all + mandatory isolation tests |
| Performance issues | Medium | Medium | Aggregated endpoint, code splitting, caching, monitoring |

### 10.2 Product Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Too many features, too complex | High | High | Ship MVP scope only; templates as starting points; feature flags per module |
| Low adoption | Medium | High | Pilot in partner schools; onboarding and quick wins in first session |
| Competition from generic tools | Medium | Medium | Invest in role-specific depth (lesson plans, workload, trend indicators) |

### 10.3 Privacy Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Student privacy concerns | Medium | High | Opt-in focus tracking, data minimization, deletion/export, consent flows |
| Data breach | Low | High | RLS deny-all, backend role only, encrypted at rest, audit logs |

---

*End of Importance & Scope*
