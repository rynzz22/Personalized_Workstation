# Talibon Workspace — Frontend Plan

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

1. [Frontend Overview](#1-frontend-overview)
2. [Structure and Organization](#2-structure-and-organization)
3. [Routes](#3-routes)
4. [State Management](#4-state-management)
5. [Design System](#5-design-system)
6. [Widget System](#6-widget-system)
7. [Key UX Flows](#7-key-ux-flows)
8. [Performance Optimization](#8-performance-optimization)

---

## 1. Frontend Overview

### 1.1 Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Framework | **React 18 + TypeScript** | UI framework |
| Build Tool | **Vite** | Fast dev server, code splitting |
| Styling | **Tailwind CSS** | Utility-first CSS |
| UI Components | **shadcn/ui** (optional) | Accessible primitives (Radix) |
| Routing | **React Router v6** | Client-side routing |
| Server State | **TanStack Query** | Data fetching, caching, optimistic updates |
| Client State | **Zustand** | UI state, current workspace, dashboard edit mode |
| Forms | **React Hook Form + Zod** | Form management, validation |
| Grid / DnD | `react-grid-layout` | Widget move/resize |
| Charts | **Recharts** | Analytics widgets |
| Rich Text | **TipTap** | Notes and lesson plan fields |
| Testing | Vitest, React Testing Library, Playwright | Unit, component, E2E tests |

### 1.2 Architecture Pattern

The frontend follows **feature-sliced design** with clear separation of concerns:

- **app/**: Application-level setup (providers, router, layouts)
- **features/**: Feature-specific slices (auth, workspaces, tasks, etc.)
- **widgets/**: Dashboard widget registry and components
- **components/**: Reusable UI primitives
- **lib/**: Utilities (API client, supabase, helpers)
- **hooks/**: Custom React hooks
- **stores/**: Zustand stores for client state

### 1.3 Key Principles

1. **Feature-sliced**: Each feature is self-contained with its own API, hooks, components, pages
2. **Server state in TanStack Query**: All API data fetched and cached via TanStack Query
3. **Client state in Zustand**: UI state (edit mode, sidebar, current workspace) in Zustand
4. **Shared UI in components/**: Reusable components stay in shared folder
5. **Widget registry**: Dashboard widgets registered in a central registry
6. **Optimistic updates**: UI updates immediately, rolled back on error

---

## 2. Structure and Organization

### 2.1 Directory Structure

```
apps/web/src/
├── app/
│   ├── App.tsx
│   ├── router.tsx                 # route tree
│   ├── providers.tsx              # QueryClient, Auth, Theme, Toasts
│   └── layouts/                   # AuthLayout, AppShell (sidebar + topbar + workspace switcher)
├── features/
│   ├── auth/                      # login, register, reset, onboarding (role picker)
│   │   ├── api.ts                 # typed API calls
│   │   ├── hooks.ts               # TanStack Query hooks
│   │   ├── components/            # auth-specific components
│   │   ├── pages/                 # auth pages
│   │   └── schemas.ts             # Zod validation schemas
│   ├── workspaces/                # switcher, create dialog, settings, members
│   ├── dashboard/                 # grid canvas, customize drawer, edit mode
│   ├── tasks/
│   ├── notes/
│   ├── calendar/
│   ├── goals/
│   ├── education/
│   │   ├── classes/
│   │   ├── students/
│   │   ├── grades/
│   │   ├── attendance/
│   │   ├── lesson-plans/          # form, template picker, duplicate
│   │   ├── assignments/
│   │   └── focus/
│   ├── documents/
│   ├── business/                  # products, customers, orders, sales
│   ├── finance/
│   ├── trackers/                  # tracker builder + records table
│   ├── analytics/
│   └── settings/                  # profile, plan, privacy (focus opt-in)
├── widgets/
│   ├── registry.ts                # widget type → component + metadata
│   ├── TaskListWidget.tsx
│   ├── CalendarTodayWidget.tsx
│   └── ...                        # one file per widget
├── components/                    # ui primitives: Button, Card, Modal, Drawer, Table, EmptyState...
├── lib/
│   ├── api.ts                     # fetch/axios wrapper, attaches JWT, error normalizer
│   ├── supabase.ts                # supabase-js client (auth + storage only)
│   └── queryKeys.ts               # TanStack Query keys
├── hooks/                         # useCurrentWorkspace, useDebounce, useOnlineStatus
├── stores/                        # Zustand: ui.store, workspace.store
└── styles/
    └── index.css                  # Tailwind layers, CSS variables
```

### 2.2 Feature Folder Pattern

Each feature folder contains:

```
feature-name/
├── api.ts              # Typed API functions
├── hooks.ts            # TanStack Query hooks
├── components/         # Feature-specific components
├── pages/              # Feature pages
└── schemas.ts          # Zod validation schemas
```

**Example: tasks feature**

```typescript
// features/tasks/api.ts
export const tasksApi = {
  list: (workspaceId: string, params: TaskFilters) =>
    api.get(`/workspaces/${workspaceId}/tasks`, { params }),
  create: (workspaceId: string, data: CreateTaskDto) =>
    api.post(`/workspaces/${workspaceId}/tasks`, data),
  // ...
};

// features/tasks/hooks.ts
export const useTasks = (workspaceId: string, filters: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', workspaceId, filters],
    queryFn: () => tasksApi.list(workspaceId, filters),
  });
};

export const useCreateTask = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.create(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', workspaceId]);
    },
  });
};
```

### 2.3 Shared Components

Reusable UI primitives in `components/`:

- Button, Input, Select, Checkbox, Radio
- Card, Modal, Drawer, Dialog
- Table, DataTable, Pagination
- Form, Label, Field
- Toast, Alert, Badge
- EmptyState, LoadingSpinner, ErrorBoundary
- Avatar, Icon, Separator

---

## 3. Routes

### 3.1 Route Structure

| Path | Page | Notes |
|---|---|---|
| `/login`, `/register`, `/forgot-password` | Auth | Public |
| `/onboarding` | Role picker, create first workspace | After first login |
| `/` | Redirect to last workspace | |
| `/w/:wid` | **Dashboard** | Default view |
| `/w/:wid/tasks` | Tasks (list, board, projects) | |
| `/w/:wid/notes` and `/notes/:id` | Notes by context | |
| `/w/:wid/calendar` | Calendar | |
| `/w/:wid/goals` and `/goals/:id` | Goals + milestones | |
| `/w/:wid/classes`, `/classes/:id` | Classes, gradebook, attendance | Teacher |
| `/w/:wid/students`, `/students/:id` | Student cards | Teacher |
| `/w/:wid/lesson-plans`, `/lesson-plans/new`, `/lesson-plans/:id` | Lesson Plan Manager | Teacher |
| `/w/:wid/subjects`, `/assignments` | Assignment Manager, workload | Student |
| `/w/:wid/focus` | Focus tracker | Opt-in |
| `/w/:wid/documents` | Document workspace | |
| `/w/:wid/sales`, `/inventory`, `/customers`, `/orders` | Business | |
| `/w/:wid/finance` | Personal finance | |
| `/w/:wid/trackers`, `/trackers/:id` | Custom trackers | |
| `/w/:wid/analytics` | Weekly report | |
| `/w/:wid/settings` | Workspace settings, modules, members | |
| `/settings/profile`, `/settings/plan` | Account | |

### 3.2 Route Guards

- **AuthGuard**: Redirects to login if not authenticated
- **WorkspaceGuard**: Validates workspace membership
- **ModuleGate**: Hides routes for disabled modules

### 3.3 Router Configuration

```typescript
// app/router.tsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    loader: workspaceLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/w/:lastWorkspaceId" />,
      },
      {
        path: 'w/:wid',
        element: <DashboardPage />,
      },
      {
        path: 'w/:wid/tasks',
        element: <TasksPage />,
      },
      // ... other routes
    ],
  },
]);
```

---

## 4. State Management

### 4.1 State Management Strategy

| Kind | Tool | Examples |
|---|---|---|
| Server state | TanStack Query | tasks, notes, dashboard; optimistic updates for task toggle, widget move |
| Client/UI state | Zustand | current workspace id, dashboard edit mode, sidebar |
| Form state | React Hook Form + Zod | lesson plan form, tracker builder |
| Auth | Supabase session via context | token auto-attached by `lib/api.ts` |
| Offline drafts | TanStack Query persister (IndexedDB) + local draft store | notes, lesson plans, tasks queue and sync on reconnect |

### 4.2 Server State (TanStack Query)

**Query Keys**

```typescript
// lib/queryKeys.ts
export const queryKeys = {
  tasks: (workspaceId: string) => ['tasks', workspaceId] as const,
  task: (workspaceId: string, id: string) => ['tasks', workspaceId, id] as const,
  notes: (workspaceId: string) => ['notes', workspaceId] as const,
  dashboard: (workspaceId: string) => ['dashboard', workspaceId] as const,
  // ...
};
```

**Optimistic Updates**

```typescript
export const useToggleTask = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.toggleComplete(workspaceId, taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries(['tasks', workspaceId]);
      const previousTasks = queryClient.getQueryData(['tasks', workspaceId]);
      queryClient.setQueryData(['tasks', workspaceId], (old) => {
        return old.map((task) =>
          task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
        );
      });
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(['tasks', workspaceId], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks', workspaceId]);
    },
  });
};
```

### 4.3 Client State (Zustand)

**UI Store**

```typescript
// stores/ui.store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  dashboardEditMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setDashboardEditMode: (edit: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  dashboardEditMode: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setDashboardEditMode: (edit) => set({ dashboardEditMode: edit }),
}));
```

**Workspace Store**

```typescript
// stores/workspace.store.ts
interface WorkspaceState {
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspaceId: null,
  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
}));
```

### 4.4 Form State (React Hook Form + Zod)

**Example: Task Form**

```typescript
// features/tasks/schemas.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueAt: z.string().optional(),
  estimatedMinutes: z.number().min(0).optional(),
});

// features/tasks/components/TaskForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function TaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = (data) => {
    // submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  );
}
```

### 4.5 Auth State

```typescript
// app/providers.tsx
import { AuthProvider } from './auth.context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// app/auth.context.tsx
import { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 5. Design System

### 5.1 Tailwind Configuration

**Tokens as CSS Variables**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          // ...
          500: 'var(--color-primary-500)',
          // ...
        },
        // ... other colors
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      spacing: {
        sidebar: 'var(--spacing-sidebar)',
      },
    },
  },
};
```

**CSS Variables**

```css
/* styles/index.css */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  /* ... */

  --radius-lg: 0.5rem;
  --radius-md: 0.375rem;
  --radius-sm: 0.25rem;

  --spacing-sidebar: 280px;
}

.dark {
  --color-primary-50: #1e3a8a;
  --color-primary-500: #60a5fa;
  /* ... */
}
```

### 5.2 Light/Dark Mode

- Class-based strategy: `dark` class on `html` element
- Toggle in settings with user preference persisted
- Respect system preference by default

### 5.3 Responsive Design

**Mobile-First Approach**

```typescript
// Dashboard example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {widgets.map(widget => (
    <Widget key={widget.id} widget={widget} />
  ))}
</div>
```

**Breakpoints**

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 5.4 Status Colors

**Trend Indicators**

| Status | Color | Icon |
|---|---|---|
| Improving | Green (green-500) | Trending up |
| Consistent | Blue (blue-500) | Minus |
| Needs attention | Amber (amber-500) | Alert |
| Significant decline | Red (red-500) | Trending down |

**Rule**: Always pair color with text label and icon, never color alone.

### 5.5 Empty States

Each widget and page has an empty state that:
- Explains what the feature does
- Offers a clear action to get started
- Uses friendly illustrations or icons

```typescript
<EmptyState
  icon={<CalendarIcon />}
  title="No events yet"
  description="Create your first event to get started"
  action={<Button onClick={handleCreate}>Create Event</Button>}
/>
```

---

## 6. Widget System

### 6.1 Widget Registry Contract

```typescript
// widgets/registry.ts
export interface WidgetDefinition<TConfig = unknown> {
  type: string;                 // matches widget_catalog.type
  module: string;               // owning module key
  title: string;
  icon: ComponentType;
  defaultSize: { w: number; h: number; minW?: number; minH?: number };
  Component: ComponentType<{ workspaceId: string; config: TConfig; data?: unknown }>;
  ConfigForm?: ComponentType<{ value: TConfig; onChange(v: TConfig): void }>;
  loader?: (ctx: { workspaceId: string; config: TConfig }) => Promise<unknown>;
}

export const widgetRegistry: Record<string, WidgetDefinition> = {
  task_list: {
    type: 'task_list',
    module: 'tasks',
    title: 'Tasks',
    icon: TaskIcon,
    defaultSize: { w: 4, h: 3, minW: 2, minH: 2 },
    Component: TaskListWidget,
    ConfigForm: TaskListConfigForm,
  },
  // ... other widgets
};
```

### 6.2 Data Flow

1. `GET /dashboard` returns layout
2. `GET /dashboard/data` returns aggregated values for all visible widgets in one request
3. Each widget reads its slice from the aggregate (no N+1 requests)
4. Widgets can refetch independently after mutations
5. Layout changes: `react-grid-layout` fires `onLayoutChange` → debounced `PUT /dashboard/layout`
6. **Priority setting** reorders `position` and on mobile determines stack order

### 6.3 Widget Catalog (Initial)

| Widget type | Module | Content |
|---|---|---|
| `task_list` / `task_progress` | tasks | Open tasks, "5 of 7 done" |
| `calendar_today` | calendar | Today's agenda |
| `notes_recent` | notes | Pinned and recent notes |
| `goal_progress` | goals | Goal with milestone bars |
| `progress_summary` | analytics | Weekly completion and feedback message |
| `classes_today` | classes | 08:00 Grade 7, 10:00 Grade 8... |
| `pending_grades` | grades | Assignments to check |
| `lesson_plans_week` | lesson_plans | Plans this week |
| `class_average` | grades | Class average and trend |
| `students_attention` | students | Students flagged Needs attention |
| `assignments_due` | assignments | Today / This week / Later |
| `workload_hours` | assignments | Estimated total hours |
| `weekly_goal` | goals | Weekly goal percentage |
| `focus_time` | focus | Focus time and ratio (opt-in) |
| `sales_today` | sales | Today's sales and profit |
| `low_stock` | inventory | Items to restock |
| `customers_count` | customers | Customer count |
| `finance_summary` | finance | Income, expenses, savings |
| `tracker_table` / `tracker_chart` | trackers | Any custom tracker |

### 6.4 Widget Component Example

```typescript
// widgets/TaskListWidget.tsx
import { useTasks } from '../features/tasks/hooks';

export function TaskListWidget({ workspaceId, config, data }: WidgetProps) {
  const { data: tasks, isLoading } = useTasks(workspaceId, {
    status: config.filterStatus,
    limit: config.limit || 5,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!tasks?.length) return <EmptyState title="No tasks" />;

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-3">Tasks</h3>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center gap-2">
            <Checkbox checked={task.status === 'done'} />
            <span className={task.status === 'done' ? 'line-through text-gray-400' : ''}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 6.5 Dashboard Grid

```typescript
// features/dashboard/components/DashboardGrid.tsx
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function DashboardGrid({ widgets, onLayoutChange }: DashboardGridProps) {
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })) }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={debounce(onLayoutChange, 500)}
    >
      {widgets.map(widget => (
        <div key={widget.id}>
          <WidgetComponent widget={widget} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
```

---

## 7. Key UX Flows

### 7.1 Onboarding

**Flow:**
1. User completes Supabase auth (login/register)
2. Redirected to `/onboarding`
3. User picks primary role (Teacher, Student, Employee, Freelancer, Business, Personal, Custom)
4. Preview of selected template shown
5. User confirms and creates first workspace
6. Dashboard tour highlights key features
7. User dropped into their new dashboard

**Components:**
- RolePicker (grid of role cards with icons)
- TemplatePreview (shows default widgets and modules)
- CreateWorkspaceForm (name, icon, color)
- DashboardTour (step-by-step guide)

### 7.2 Customize Workspace

**Flow:**
1. User clicks "Customize Workspace" button on dashboard
2. Drawer opens with tabs:
   - **Modules**: Toggle available modules on/off
   - **Widgets**: Add new widgets to dashboard
   - **Priority**: Choose what matters most (reorders dashboard)
3. User enables/disables modules
4. User adds widgets from catalog
5. User sets priority (e.g., "Tasks" puts Tasks widget first)
6. Changes saved automatically

**Edit Mode:**
- Toggle "Edit Mode" to enable drag/resize
- Widgets show resize handles
- Drag widgets to reposition
- Resize widgets by dragging corners
- Changes autosave via debounced API call

### 7.3 Workspace Switcher

**Flow:**
1. User clicks workspace name in top bar
2. Dropdown shows all workspaces with icons
3. User selects different workspace
4. App navigates to `/w/:wid`
5. Last workspace remembered for next visit

**Components:**
- WorkspaceSwitcher (dropdown with workspace list)
- WorkspaceAvatar (icon + color)
- CreateWorkspaceButton (quick add new workspace)

### 7.4 Lesson Plan

**Flow:**
1. User navigates to Lesson Plans
2. Clicks "New Lesson Plan"
3. Selects template (Lecture, Activity, Discussion, etc.)
4. Structured form appears with sections based on template
5. User fills in fields with autosave
6. User attaches documents via file picker
7. User saves or marks as "Ready"
8. To reuse: user clicks "Duplicate", chooses new date, optionally copies attachments

**Components:**
- LessonPlanForm (structured form with autosave)
- TemplatePicker (grid of template cards)
- DocumentUploader (file picker with progress)
- DuplicateDialog (configure duplication options)

### 7.5 Assignments

**Flow:**
1. Student navigates to Assignments
2. Quick-add button opens dialog
3. User enters: subject, title, deadline, priority, estimated time
4. Assignment created and automatically grouped
5. Dashboard shows:
   - "Today" section with due today
   - "This week" section with due this week
   - "Later" section with future deadlines
6. Workload widget shows total hours and largest item

**Components:**
- AssignmentQuickAdd (dialog with form)
- AssignmentList (grouped by time)
- WorkloadWidget (hours breakdown)

---

## 8. Performance Optimization

### 8.1 Code Splitting

**Route-based splitting**

```typescript
// app/router.tsx
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const TasksPage = lazy(() => import('./features/tasks/pages/TasksPage'));
```

**Component-based splitting**

```typescript
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

### 8.2 Lazy Loading

```typescript
// features/dashboard/components/Dashboard.tsx
import { Suspense, lazy } from 'react';

const WidgetGrid = lazy(() => import('./WidgetGrid'));

export function Dashboard() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WidgetGrid />
    </Suspense>
  );
}
```

### 8.3 Image Optimization

- Use Next.js Image component if migrating to Next.js
- Or use `react-image` with lazy loading
- Serve WebP format when supported
- Responsive images with srcset

### 8.4 Bundle Size

**Vite build analysis**

```bash
npm run build
npm run build:analyze
```

**Optimization strategies:**
- Tree shaking (automatic with Vite)
- Remove unused dependencies
- Use ES modules over CommonJS
- Minimize third-party libraries

### 8.5 API Optimization

**Aggregated endpoint**

```typescript
// Single request for all widget data
const { data } = useQuery({
  queryKey: ['dashboard-data', workspaceId],
  queryFn: () => api.get(`/workspaces/${workspaceId}/dashboard/data`),
});
```

**Pagination**

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['tasks', workspaceId],
  queryFn: ({ pageParam }) => tasksApi.list(workspaceId, { page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
});
```

### 8.6 Caching Strategy

**TanStack Query cache configuration**

```typescript
// app/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### 8.7 Offline Support

**TanStack Query persister**

```typescript
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

<QueryClientProvider client={queryClient}>
  <PersistQueryClientProvider client={queryClient} persister={persister}>
    {/* app */}
  </PersistQueryClientProvider>
</QueryClientProvider>
```

**Local draft store**

```typescript
// stores/draft.store.ts
interface DraftState {
  drafts: Record<string, any>;
  setDraft: (key: string, value: any) => void;
  clearDraft: (key: string) => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  drafts: {},
  setDraft: (key, value) => set((state) => ({ drafts: { ...state.drafts, [key]: value } })),
  clearDraft: (key) => set((state) => {
    const { [key]: _, ...rest } = state.drafts;
    return { drafts: rest };
  }),
}));
```

---

## 9. Testing

### 9.1 Unit Tests (Vitest)

**Component testing**

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 9.2 Component Tests (React Testing Library)

**Form testing**

```typescript
// features/tasks/components/TaskForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });
});
```

### 9.3 E2E Tests (Playwright)

**Critical user flows**

```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('onboarding flow', async ({ page }) => {
  await page.goto('/onboarding');
  await page.click('[data-testid="role-teacher"]');
  await page.click('[data-testid="template-preview"]');
  await page.fill('[name="name"]', 'My School Workspace');
  await page.click('[data-testid="create-workspace"]');
  await expect(page).toHaveURL('/w/:wid');
});
```

**Flows to test:**
- Onboarding
- Create task
- Customize dashboard
- Lesson plan duplicate
- Add assignment
- Workspace switch

---

## 10. Accessibility

### 10.1 WCAG 2.1 AA Compliance

**Keyboard navigation**
- All interactive elements keyboard accessible
- Focus indicators visible
- Skip to main content link

**Screen reader support**
- Semantic HTML
- ARIA labels where needed
- Alt text for images

**Color contrast**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Never use color alone to convey meaning

### 10.2 Accessibility Testing

**Automated checks**

```bash
npm run test:a11y
```

**Manual testing**
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Test with keyboard only
- Test with high contrast mode
- Test with text zoom

---

*End of Frontend Plan*
