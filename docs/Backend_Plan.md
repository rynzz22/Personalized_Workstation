# Talibon Workspace — Backend Plan

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

1. [Backend Overview](#1-backend-overview)
2. [Layering Strategy](#2-layering-strategy)
3. [Module Map](#3-module-map)
4. [Cross-Cutting Components](#4-cross-cutting-components)
5. [Domain Rules](#5-domain-rules)
6. [Environment Configuration](#6-environment-configuration)

---

## 1. Backend Overview

### 1.1 Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Framework | **NestJS (TypeScript)** | Modular monolith, REST API |
| ORM | **Prisma** | Type-safe database access, migrations |
| Validation | class-validator / class-transformer | DTO validation |
| API Documentation | `@nestjs/swagger` | OpenAPI / Swagger UI |
| Database | **PostgreSQL (Supabase)** | Managed database |
| Authentication | **Supabase Auth** | JWT token management |
| File Storage | **Supabase Storage** | File uploads/downloads |
| Jobs/Scheduling | `@nestjs/schedule` | Cron jobs, weekly reports |
| Logging | **Pino** (`nestjs-pino`) | Structured logging |
| Testing | Jest, Supertest | Unit and integration tests |

### 1.2 Architecture Pattern

The backend follows a **modular monolith** pattern with clear separation of concerns:

- **Modules**: Feature-specific modules (auth, workspaces, tasks, education, business, etc.)
- **Layering**: Controller → Service → Repository (optional) → Prisma
- **Cross-cutting**: Guards, interceptors, filters, pipes in `common/` directory
- **Infrastructure**: Database, storage, logging in `infra/` directory

### 1.3 Key Principles

1. **Workspace-scoped everything**: All data queries include `workspaceId` filter
2. **Authorization in service layer**: Guards handle basic checks, services handle complex authorization
3. **Business logic in services**: Controllers are thin, services contain domain rules
4. **Type safety**: Prisma provides typed database access, Zod for shared validation
5. **Defense in depth**: Guards, scoped queries, RLS deny-all on database

---

## 2. Layering Strategy

### 2.1 Three-Layer Architecture

```
Controller  → HTTP only: routing, DTOs, guards, Swagger decorators
Service     → business logic, transactions, authorization checks beyond guards
Repository  → (optional) Prisma queries for complex reads; simple CRUD uses Prisma in service
```

### 2.2 Layer Responsibilities

**Controller Layer**
- HTTP request/response handling
- Route definition and parameter extraction
- DTO validation via ValidationPipe
- Guard application (authentication, authorization)
- Swagger documentation decorators
- **Never touches Prisma directly**

**Service Layer**
- Business logic implementation
- Transaction management
- Authorization checks beyond guards
- Domain rule enforcement
- Data transformation
- Direct Prisma calls (or via repository for complex queries)

**Repository Layer (Optional)**
- Complex Prisma queries
- Read optimization
- Aggregation logic
- Used only when queries are complex enough to warrant abstraction

### 2.3 Layer Rules

1. Controllers never touch Prisma
2. Modules expose services, not repositories
3. Cross-module access goes through exported services
4. All database queries must include `workspaceId` filter
5. Use helper `scopedPrisma(workspaceId)` to prevent unscoped queries

### 2.4 Example Layering

```typescript
// Controller
@Controller('workspaces/:workspaceId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('viewer', 'member', 'admin', 'owner')
  async findAll(@Param('workspaceId') workspaceId: string) {
    return this.tasksService.findAll(workspaceId);
  }
}

// Service
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.task.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: { sort_order: 'asc' }
    });
  }
}
```

---

## 3. Module Map

### 3.1 Module Structure

```
src/modules/
├── auth/             # JWT strategy, /me
├── profiles/         # user profile, preferences
├── workspaces/       # CRUD, members, invitations
├── templates/        # role templates (Teacher, Student, ...)
├── modules-registry/ # available modules + per-workspace enablement
├── dashboard/        # dashboard settings, widgets, layout, aggregated data
├── tasks/            # tasks, projects, task lists
├── notes/            # notes, note categories
├── calendar/         # events, reminders
├── goals/            # goals, milestones
├── habits/           # habit tracker
├── time-tracking/    # time entries
├── documents/        # files, attachments, signed URLs
├── education/
│   ├── subjects/
│   ├── classes/
│   ├── students/     # includes attendance
│   ├── grades/       # assessments + scores
│   ├── lesson-plans/ # plans, templates, duplicate
│   ├── assignments/  # student assignments + workload
│   └── focus/        # focus sessions (opt-in)
├── business/
│   ├── products/     # inventory + stock movements
│   ├── customers/
│   ├── orders/       # orders + sales
│   └── finance/      # transactions, categories
├── trackers/         # custom trackers + records
├── analytics/        # weekly reports, trends, feedback
├── notifications/
├── billing/          # plans, subscriptions, entitlements
├── ai/               # reserved (Phase 6)
└── health/           # liveness / readiness
```

### 3.2 Module Responsibilities

**Core Modules**
- **auth**: JWT strategy, token verification, `/me` endpoint
- **profiles**: User profile CRUD, preferences
- **workspaces**: Workspace CRUD, membership management, invitations
- **templates**: Role template management, template application
- **modules-registry**: Module catalog, per-workspace enablement
- **dashboard**: Dashboard settings, widget CRUD, layout management, aggregated data

**Productivity Modules**
- **tasks**: Task CRUD, projects, task lists, completion, reordering
- **notes**: Note CRUD, categories, rich text, search
- **calendar**: Event CRUD, recurrence, reminders, today's agenda
- **goals**: Goal CRUD, milestones, progress calculation
- **habits**: Habit tracking, logs, streaks
- **time-tracking**: Time entries, timer

**Education Modules**
- **subjects**: Subject management
- **classes**: Class management, schedules
- **students**: Student records, CSV import, enrollment
- **grades**: Assessments, grade entry, gradebook, student progress
- **lesson-plans**: Lesson plan CRUD, templates, duplication
- **assignments**: Assignment management, workload calculation
- **focus**: Focus sessions (opt-in)

**Business Modules**
- **products**: Inventory management, stock movements, low-stock alerts
- **customers**: Customer management
- **orders**: Order management, sales tracking
- **finance**: Transaction management, categories, summaries

**System Modules**
- **documents**: File management, signed URLs, attachments
- **trackers**: Custom tracker builder, records
- **analytics**: Weekly reports, trends, feedback generation
- **notifications**: Notification management
- **billing**: Plan management, subscriptions, entitlements
- **ai**: AI service abstraction (Phase 6)
- **health**: Health checks

### 3.3 Module Dependencies

- All modules depend on `common/` for guards, decorators, DTOs
- Education modules depend on core modules (tasks, notes, calendar)
- Business modules are independent (can be disabled per workspace)
- Analytics module reads from all enabled modules
- Billing module checks entitlements for feature gates

---

## 4. Cross-Cutting Components

### 4.1 Guards

**JwtAuthGuard**
- Validates Supabase JWT (JWKS or JWT secret)
- Attaches `req.user` with profile information
- Applied to all routes except `/health`

**WorkspaceGuard**
- Reads `:workspaceId` from route parameters
- Loads `workspace_members` row
- Attaches `req.workspace` and `req.member` with role
- Throws 404 if workspace not found or user not member

**RolesGuard**
- Reads `@Roles()` decorator on controller method
- Checks if user's role meets minimum requirement
- Role hierarchy: viewer < member < admin < owner

**FeatureGuard**
- Reads `@RequireFeature('feature.key')` decorator
- Checks user's plan entitlements
- Throws 403 with `PLAN_LIMIT_REACHED` if not entitled

**ThrottlerGuard**
- Rate limiting by IP address
- Configurable limit (default: 100 requests per minute)
- Applied to all routes

### 4.2 Decorators

**@CurrentUser()**
- Param decorator to extract current user from request
- Usage: `@CurrentUser() user: User`

**@CurrentWorkspace()**
- Param decorator to extract current workspace from request
- Usage: `@CurrentWorkspace() workspace: Workspace`

**@Roles(...roles)**
- Method decorator to specify required roles
- Usage: `@Roles('admin', 'owner')`

**@RequireFeature(featureKey)**
- Method decorator to specify required feature
- Usage: `@RequireFeature('analytics.advanced')`

### 4.3 Pipes

**ValidationPipe**
- Global pipe for DTO validation
- Uses class-validator and class-transformer
- Whitelist mode to prevent mass assignment
- Configuration: `whitelist: true, forbidNonWhitelisted: true`

### 4.4 Interceptors

**ResponseInterceptor**
- Wraps successful responses in envelope
- Format: `{ data: <result>, meta: { page, limit, total } }`
- Applies to all successful responses

**LoggingInterceptor**
- Logs request duration
- Attaches request ID for correlation
- Structured logging with Pino

### 4.5 Filters

**AllExceptionsFilter**
- Normalizes all exceptions to consistent error format
- Format: `{ error: { code, message, details, requestId } }`
- Maps exceptions to HTTP status codes
- Logs errors with request context

### 4.6 DTOs

**PaginationDto**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `sort`: string (default: 'created_at')
- `order`: 'asc' | 'desc' (default: 'desc')
- `q`: string (search query)

**Common Response Types**
- `SuccessResponse<T>`: `{ data: T, meta?: PaginationMeta }`
- `ErrorResponse`: `{ error: { code, message, details?, requestId } }`

---

## 5. Domain Rules

### 5.1 Business Logic in Services

| Rule | Module | Behavior |
|---|---|---|
| Workload estimate | assignments | Sum `estimated_minutes` of non-done assignments; group Today (due ≤ tomorrow), This week, Later; flag the largest item |
| Trend indicator | analytics | Compare recent window average with prior window; map delta to Improving / Consistent / Needs attention / Significant decline (thresholds configurable) |
| Progress feedback | analytics | Generate message only when backed by a real delta (e.g., "4 assignments, 2 more than last week"); otherwise return nothing |
| Lesson plan reuse | lesson-plans | Duplicate copies fields, resets dates, optionally copies attachments |
| Stock alerts | products | `low_stock` when `quantity <= reorder_level` |
| Profit | orders / finance | Profit = revenue − cost per period |
| Template apply | templates | Creates modules + widgets + sample categories in one transaction |
| Feature gating | billing | Free: 1 workspace, basic modules, limited widgets |
| Goal progress | goals | Weighted milestone progress; milestone progress from linked tasks when present |
| Student progress | analytics | Computed from grades, attendance, completion rates; trend based on comparison with prior period |

### 5.2 Workspace Scoping

**Helper Function**
```typescript
function scopedPrisma(workspaceId: string) {
  return {
    task: { findMany: (args) => prisma.task.findMany({ ...args, where: { ...args.where, workspaceId } }) },
    // ... similar for all domain models
  };
}
```

**Rule**: All queries must use workspace-scoped access. Add lint rule to enforce.

### 5.3 Authorization Checks

**Resource Ownership**
- Nested resources must belong to parent workspace
- Example: milestone must belong to goal and workspace
- Example: grade must belong to assessment and student in same workspace

**Role-Based Access**
- Viewers: read-only
- Members: read + create + edit own data
- Admins: read + create + edit + delete + manage members
- Owners: all admin permissions + billing + delete workspace

**Feature-Based Access**
- Check plan entitlements before allowing feature access
- Example: advanced analytics requires premium tier
- Example: custom trackers require business tier

### 5.4 Transaction Management

**Critical Transactions**
- Template application: create modules, widgets, sample data
- Workspace creation: create workspace, owner membership, apply template
- Order creation: create order, items, adjust stock, calculate profit
- Grade entry: update grades, recalculate student progress

**Example**
```typescript
async createWorkspace(data: CreateWorkspaceDto) {
  return this.prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({ data: { ... } });
    await tx.workspaceMember.create({ data: { workspaceId: workspace.id, userId, role: 'owner' } });
    await this.applyTemplate(tx, workspace.id, data.template);
    return workspace;
  });
}
```

---

## 6. Environment Configuration

### 6.1 Environment Variables

**apps/api**
```
NODE_ENV=                    # development | staging | production
PORT=3000
DATABASE_URL=                # pooled (pgbouncer) connection
DIRECT_URL=                  # direct connection for migrations
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=         # or JWKS URL
SUPABASE_STORAGE_BUCKET=documents
CORS_ORIGINS=https://app.example.com
THROTTLE_LIMIT=100
SENTRY_DSN=
```

### 6.2 Configuration Module

**Config Validation**
```typescript
// src/config/config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  SUPABASE_STORAGE_BUCKET: z.string().default('documents'),
  CORS_ORIGINS: z.string(),
  THROTTLE_LIMIT: z.string().default('100'),
  SENTRY_DSN: z.string().optional(),
});

export const config = envSchema.parse(process.env);
```

### 6.3 Infrastructure Setup

**Prisma Service**
```typescript
// src/infra/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Supabase Client**
```typescript
// src/infra/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  get storage() {
    return this.client.storage;
  }
}
```

**Logger**
```typescript
// src/infra/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class LoggerService implements LoggerService {
  private logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  });

  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message);
  }
}
```

---

## 7. API Documentation

### 7.1 Swagger Setup

```typescript
// src/main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Talibon Workspace API')
  .setDescription('Personalized Productivity, Planning and Progress Platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 7.2 Swagger Decorators

```typescript
@Controller('workspaces/:workspaceId/tasks')
@ApiTags('Tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'List tasks' })
  @ApiResponse({ status: 200, description: 'Success', type: [TaskDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Param('workspaceId') workspaceId: string) {
    return this.tasksService.findAll(workspaceId);
  }
}
```

### 7.3 OpenAPI Specification

- Swagger UI available at `/api/docs`
- OpenAPI JSON available at `/api/docs-json`
- Includes all endpoints, DTOs, authentication scheme
- Generated from decorators in controllers

---

## 8. Error Handling

### 8.1 Exception Classes

```typescript
// src/common/exceptions/
export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class BusinessException extends HttpException {
  constructor(code: string, message: string) {
    super({ code, message }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
```

### 8.2 Error Response Format

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

### 8.3 Error Codes

| HTTP | Code | Description |
|---|---|---|
| 400 | VALIDATION_ERROR | DTO validation failed |
| 401 | UNAUTHENTICATED | JWT invalid or expired |
| 403 | FORBIDDEN | Insufficient permissions |
| 403 | PLAN_LIMIT_REACHED | Feature not available on current plan |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (duplicate) |
| 422 | BUSINESS_RULE_VIOLATION | Business rule violated |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected error |

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Focus**: Service layer business logic
- Workload estimate calculation
- Trend indicator calculation
- Feedback message generation
- Template application
- Stock and profit calculations

**Tools**: Jest

```typescript
describe('AssignmentsService', () => {
  it('should calculate workload correctly', () => {
    const result = service.calculateWorkload(assignments);
    expect(result.totalMinutes).toBe(510);
    expect(result.groups.today.count).toBe(1);
  });
});
```

### 9.2 Integration Tests

**Focus**: Guard enforcement, CRUD flows, workspace isolation
- Auth guard verification
- Workspace guard verification
- Cross-workspace access denial
- CRUD end-to-end flows

**Tools**: Jest + Supertest + test database

```typescript
describe('TasksController (e2e)', () => {
  it('should prevent cross-workspace access', async () => {
    const response = await request(app.get('/workspaces/workspace-b/tasks'))
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(403);
  });
});
```

### 9.3 Mandatory Security Tests

- Cross-workspace access attempts on every module
- Role enforcement (viewer cannot edit)
- Plan limit enforcement (free tier cannot access premium features)
- Unscoped query prevention

---

## 10. Deployment

### 10.1 Build Process

```bash
# Build
npm run build

# Output
dist/
├── main.js
├── main.js.map
└── ...
```

### 10.2 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 10.3 Health Checks

- **Liveness**: GET `/health` - returns 200 if service is running
- **Readiness**: GET `/health/ready` - returns 200 if database connection is healthy

---

*End of Backend Plan*
