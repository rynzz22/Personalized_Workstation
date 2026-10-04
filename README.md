# Talibon Workspace

> *"Your work, your dashboard, your way."*
> Personalized Productivity, Planning and Progress Platform

Talibon Workspace is a customizable digital platform where each user builds a dashboard around their role, goals and responsibilities. A teacher, student, employee, freelancer or small business owner uses the same platform and sees completely different things.

---

## 📋 Monorepo Structure

```
talibon-workspace/
├── apps/
│   ├── api/                          # NestJS Backend Application
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Complete PostgreSQL domain models
│   │   │   ├── migrations/           # Initial migration
│   │   │   └── seed.ts               # Catalogs & role templates seed
│   │   ├── src/
│   │   │   ├── main.ts               # Swagger & NestJS bootstrap
│   │   │   ├── app.module.ts         # Root modular monolith module
│   │   │   ├── config/               # Zod environment validation
│   │   │   ├── common/               # Guards, decorators, filters, interceptors, DTOs
│   │   │   │   ├── guards/           # JwtAuthGuard, WorkspaceGuard, RolesGuard, FeatureGuard
│   │   │   │   ├── decorators/       # @CurrentUser(), @CurrentWorkspace(), @Roles()
│   │   │   │   ├── interceptors/     # ResponseInterceptor, LoggingInterceptor
│   │   │   │   ├── filters/          # AllExceptionsFilter
│   │   │   │   └── dto/              # PaginationDto
│   │   │   ├── infra/                # PrismaService, SupabaseService, AppLogger
│   │   │   └── modules/              # Feature modules: auth, workspaces, templates,
│   │   │                             # modules-registry, dashboard, tasks, notes,
│   │   │                             # calendar, goals, education, business, trackers, analytics
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── web/                          # React + Vite Frontend Application
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/               # Base UI Component Library
│       │   │       ├── Button.tsx, Input.tsx, Select.tsx, Checkbox.tsx
│       │   │       ├── Card.tsx, Modal.tsx, Drawer.tsx, Dialog.tsx
│       │   │       ├── Table.tsx, DataTable.tsx, Pagination.tsx
│       │   │       ├── Form.tsx, Label.tsx, Field.tsx
│       │   │       ├── Badge.tsx, Alert.tsx, Toast.tsx
│       │   │       ├── Feedback.tsx (EmptyState, LoadingSpinner, ErrorBoundary)
│       │   │       └── Primitives.tsx (Avatar, Icon, Separator)
│       │   ├── features/             # Feature-sliced design
│       │   ├── widgets/              # Dynamic dashboard widget catalog
│       │   └── context/              # Client state & workspace switcher
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
│
├── packages/
│   └── shared/                       # Shared contracts & validation
│       ├── src/
│       │   ├── enums.ts              # MemberRole, TemplateKey, PriorityLevel, TrendStatus
│       │   ├── schemas.ts            # Zod validation schemas
│       │   └── types.ts              # API contracts & response envelopes
│       └── package.json
│
├── .github/workflows/
│   ├── ci-api.yml                    # NestJS lint, test, typecheck, Docker
│   ├── ci-web.yml                    # React lint, test, typecheck, Playwright
│   ├── deploy-api.yml                # Prisma migrate deploy & container rollout
│   └── deploy-web.yml                # Static CDN distribution
│
├── docs/                             # Full architectural blueprints
├── server.ts                         # Dual-engine server: NestJS API + Swagger + Vite SPA
├── pnpm-workspace.yaml
└── package.json
```

---

## 🛠 Tech Stack

### Backend (`apps/api`)
- **Framework**: NestJS (TypeScript)
- **Database / ORM**: PostgreSQL + Prisma ORM
- **API Documentation**: OpenAPI / Swagger UI at `/api/docs`
- **Authentication**: Supabase Auth JWT validation
- **Logging**: Structured Logging Interceptor
- **Validation**: `class-validator` & `class-transformer` with whitelisting

### Frontend (`apps/web`)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion
- **Icons**: Lucide React
- **Architecture**: Feature-sliced with centralized Widget Registry

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install # or pnpm install
```

### 2. Generate Prisma Database Client
```bash
npm run prisma:generate
```

### 3. Seed Module & Widget Catalogs
```bash
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
- App will be running on `http://localhost:3000`
- Interactive OpenAPI / Swagger UI documentation is available at `http://localhost:3000/api/docs`

---

## 🔒 Cross-Cutting Architecture

- **Workspace Scoping**: Every domain table has `workspace_id` foreign key. All queries are strictly scoped to `workspaceId`.
- **JWT Authentication (`JwtAuthGuard`)**: Validates Supabase JWT and attaches `req.user`.
- **Workspace Membership (`WorkspaceGuard`)**: Validates active membership for `:workspaceId`.
- **Role-Based Access Control (`RolesGuard`)**: Enforces `viewer < member < admin < owner` hierarchy.
- **Response Envelope (`ResponseInterceptor`)**: Automatically wraps responses in `{ data, meta }`.
- **Normalized Errors (`AllExceptionsFilter`)**: Standardizes errors into `{ error: { code, message, details, requestId } }`.

---

## 📄 License
Apache-2.0
