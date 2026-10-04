# Talibon Workspace

> *"Your work, your dashboard, your way."*
> Personalized Productivity, Planning and Progress Platform

A customizable digital platform where each user builds a dashboard around their role, goals and responsibilities. A teacher, student, employee, freelancer or small business owner uses the same platform and sees completely different things.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Talibon Workspace is a modular, widget-based productivity platform that adapts to different user roles through templates and customizable dashboards. It is **not** a teacher app or a student app—it's a system made of **modules** (functional blocks) and **widgets** (visual pieces on the dashboard) that users add, arrange, and resize.

### Core Concepts

- **Role-aware starting point**: Templates for Teacher, Student, Employee, Freelancer, Business, Personal, Custom
- **Modules**: Functional blocks like Tasks, Notes, Calendar, Goals, Students, Grades, Inventory, Sales, Finance
- **Widgets**: Dashboard tiles that can be added, moved, and resized
- **Context**: Multiple workspaces per user (School, Personal, Business)

### Position in Ecosystem

- **Talibon Workspace**: Individual productivity layer
- **Talibon Intra-Office**: Organizational operations (integration in Phase 5)
- **Bao Bao App**: Education-specific (Workspace is broader and not limited to Talibon)

---

## ✨ Key Features

### MVP (Phases 1-2)

- ✅ User authentication via Supabase
- ✅ Workspace creation from role templates
- ✅ Customizable dashboard with draggable widgets
- ✅ Core modules: Tasks, Notes, Calendar, Goals
- ✅ Teacher tools: Classes, Students, Grades, Lesson Plans
- ✅ Student tools: Assignments, Workload tracking, Deadlines
- ✅ Progress indicators with trend analysis
- ✅ Progress-based feedback messages

### Post-MVP (Phases 3-6)

- 📎 Document attachments
- 👁️ Opt-in focus/screen-time tracking
- 🔔 In-app notifications
- 💰 Finance, sales, inventory management
- 📊 Custom trackers
- 📈 Advanced analytics
- 🏫 Education package (institution licensing)
- 🔗 Intra-Office integration
- 🤖 AI assistant (optional)

---

## 📚 Documentation

The project documentation is organized into separate files for focused reference:

| Document | Description |
|----------|-------------|
| [Importance_Scope.md](./Importance_Scope.md) | Project vision, core ideas, design principles, MVP scope, functional and non-functional requirements |
| [Architecture_Plan.md](./Architecture_Plan.md) | High-level architecture, architectural decisions, request lifecycle, repository structure, deployment |
| [Schema_Plan.md](./Schema_Plan.md) | Database conventions, entity relationships, complete schema tables, storage buckets, migrations |
| [Backend_Plan.md](./Backend_Plan.md) | Backend layering, module map, cross-cutting components, domain rules, environment configuration |
| [API_Plan.md](./API_Plan.md) | API conventions, response formats, all API endpoints organized by module, example payloads |
| [Frontend_Plan.md](./Frontend_Plan.md) | Frontend structure, routes, state management, design system, widget system, UX flows |
| [Tasks_Plan.md](./Tasks_Plan.md) | Overall roadmap (Phases 0-6), detailed phase breakdown, definition of done, sprint planning |
| [SystemCluster.md](./SystemCluster.md) | Combined document with all sections together |

---

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (server), Zustand (client)
- **Forms**: React Hook Form + Zod
- **Grid/DnD**: react-grid-layout
- **Charts**: Recharts
- **Rich Text**: TipTap
- **Testing**: Vitest, React Testing Library, Playwright

### Backend

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Validation**: class-validator / class-transformer
- **API Docs**: @nestjs/swagger
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Jobs**: @nestjs/schedule
- **Logging**: Pino
- **Testing**: Jest, Supertest

### Infrastructure

- **Package Manager**: pnpm (workspaces)
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel/Netlify (frontend), Railway/Render/Fly.io (backend)
- **Database**: Supabase (managed PostgreSQL)
- **Monitoring**: Sentry, Pino logs

---

## 📁 Project Structure

```
talibon-workspace/
├── apps/
│   ├── api/                      # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/           # env validation, configuration
│   │   │   ├── common/           # guards, decorators, filters, interceptors, pipes, dto
│   │   │   ├── infra/            # prisma, supabase client, storage, logger
│   │   │   └── modules/          # feature modules
│   │   ├── test/                 # e2e
│   │   └── package.json
│   └── web/                      # React + Vite frontend
│       ├── src/
│       │   ├── main.tsx
│       │   ├── app/              # providers, router, layouts
│       │   ├── features/         # feature slices
│       │   ├── widgets/          # widget registry + widget components
│       │   ├── components/       # shared UI
│       │   ├── lib/              # api client, supabase, utils
│       │   ├── hooks/
│       │   ├── stores/           # Zustand
│       │   └── styles/
│       ├── index.html
│       ├── tailwind.config.ts
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   └── shared/                   # optional: Zod schemas, enums, API types
├── docs/
│   ├── Importance_Scope.md
│   ├── Architecture_Plan.md
│   ├── Schema_Plan.md
│   ├── Backend_Plan.md
│   ├── API_Plan.md
│   ├── Frontend_Plan.md
│   ├── Tasks_Plan.md
│   └── SystemCluster.md
├── .github/workflows/            # ci-api.yml, ci-web.yml
├── pnpm-workspace.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account (for dev database and auth)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd talibon-workspace

# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### Environment Setup

**apps/api/.env**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=              # Your Supabase pooled connection string
DIRECT_URL=                # Your Supabase direct connection string
SUPABASE_URL=              # Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY= # Your Supabase service role key
SUPABASE_JWT_SECRET=       # Your Supabase JWT secret
SUPABASE_STORAGE_BUCKET=documents
CORS_ORIGINS=http://localhost:5173
THROTTLE_LIMIT=100
```

**apps/web/.env**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=         # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Your Supabase anon key
```

### Database Setup

```bash
# Generate Prisma client
cd apps/api
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed
```

### Running the Application

```bash
# Terminal 1: Start backend
cd apps/api
pnpm run dev

# Terminal 2: Start frontend
cd apps/web
pnpm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API Docs: http://localhost:3000/api/docs

---

## 💻 Development

### Code Style

- **ESLint**: Linting for TypeScript and React
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update build process
```

### Branching Strategy

- **main**: Production branch
- **develop**: Development branch
- **feature/***: Feature branches
- **fix/***: Bug fix branches

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create pull request to `develop`
5. CI must pass
6. Code review required
7. Merge after approval

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/api

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Watch mode
pnpm test:watch
```

### Frontend Tests

```bash
cd apps/web

# Unit/component tests
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Watch mode
pnpm test:watch
```

### Test Coverage

```bash
# Backend
cd apps/api
pnpm test:cov

# Frontend
cd apps/web
pnpm test:cov
```

---

## 🚢 Deployment

### Backend Deployment

```bash
cd apps/api

# Build
pnpm run build

# Run migrations (production)
pnpm prisma migrate deploy

# Start production server
pnpm run start:prod
```

### Frontend Deployment

```bash
cd apps/web

# Build
pnpm run build

# Preview build
pnpm run preview
```

### CI/CD

GitHub Actions workflows:
- `ci-api.yml`: Backend lint, test, build
- `ci-web.yml`: Frontend lint, test, build
- `deploy-api.yml`: Deploy backend to production
- `deploy-web.yml`: Deploy frontend to production

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Read the documentation before starting
2. Create an issue for bugs or feature requests
3. Fork the repository
4. Create a feature branch
5. Make your changes
6. Add tests for new functionality
7. Ensure all tests pass
8. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility standards (WCAG 2.1 AA)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `docs/` folder

---

## 🗺 Roadmap

### Phase 0: Foundation (1 week)
- ✅ Monorepo setup
- ✅ CI/CD pipelines
- ✅ Supabase configuration
- ✅ Base schema and seeding

### Phase 1: Core Platform (5-6 weeks)
- 🔄 Auth and workspaces
- 🔄 Dashboard and widget system
- 🔄 Tasks, notes, calendar, goals
- 🔄 Basic analytics

### Phase 2: Teacher and Student MVP (5-6 weeks)
- ⏳ Teacher tools (classes, students, grades, lesson plans)
- ⏳ Student tools (assignments, workload)
- ⏳ Progress indicators and feedback
- ⏳ Pilot readiness

### Phase 3: Documents, Focus, Notifications (3-4 weeks)
- ⏳ Document attachments
- ⏳ Focus tracking (opt-in)
- ⏳ Notifications
- ⏳ Plan gating

### Phase 4: Business and Custom Trackers (5-6 weeks)
- ⏳ Finance, sales, inventory
- ⏳ Custom tracker builder
- ⏳ General modules

### Phase 5: Advanced Analytics and Integrations (5-6 weeks)
- ⏳ Advanced analytics
- ⏳ School package
- ⏳ Intra-Office integration
- ⏳ Billing

### Phase 6: AI Assistant (Optional) (3-4 weeks)
- ⏳ AI service abstraction
- ⏳ AI features (lesson plans, organization, insights)
- ⏳ Privacy review

---

*Built with ❤️ by the Talibon Workspace team*
