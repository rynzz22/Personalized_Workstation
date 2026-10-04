# Talibon Workspace Agent Skill

**Purpose**: Guide agents working on the Talibon Workspace project to maintain consistency, minimize token usage, and follow coding standards.

---

## Project Overview

Talibon Workspace is a modular, widget-based productivity platform built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **State**: TanStack Query (server), Zustand (client)

**Architecture**: Modular monolith with separate deployable frontend and backend apps in a pnpm workspace.

---

## Documentation References

Before making changes, consult these documents (in this order of priority):

1. **[Tasks_Plan.md](../../Tasks_Plan.md)** - Current phase and feature requirements
2. **[Backend_Plan.md](../../Backend_Plan.md)** - Backend layering, modules, domain rules
3. **[Frontend_Plan.md](../../Frontend_Plan.md)** - Frontend structure, state management, UX flows
4. **[API_Plan.md](../../API_Plan.md)** - API endpoints and conventions
5. **[Schema_Plan.md](../../Schema_Plan.md)** - Database schema and conventions
6. **[Architecture_Plan.md](../../Architecture_Plan.md)** - High-level architecture and decisions

**Do not read the entire SystemCluster.md** - it's a combined reference. Use the focused documents above.

---

## Token Usage Optimization

### Reading Files

- **Read only what you need**: Use `read` with `offset` and `limit` for large files
- **Use grep for searches**: Don't read entire files to find specific code
- **Batch related reads**: Read multiple files in a single tool call when possible
- **Start with schema**: When working on a feature, read the relevant schema table first

### Code Generation

- **Be concise**: Generate only the necessary code, not extensive comments
- **Use existing patterns**: Follow the established patterns in the codebase
- **Avoid repetition**: Don't regurgitate documentation in code comments
- **Leverage types**: TypeScript interfaces should be self-documenting

### Tool Usage

- **Combine independent calls**: Make multiple independent tool calls in a single response
- **Use code_search for exploration**: When searching for code, use the code_search tool first
- **Limit grep scope**: Use glob patterns to narrow search scope

---

## Coding Standards

### Backend (NestJS)

**Layering**
```
Controller → Service → Prisma
```
- Controllers: HTTP only (routing, DTOs, guards, Swagger)
- Services: Business logic, transactions, authorization
- Never touch Prisma in controllers

**Module Structure**
```
src/modules/feature-name/
├── feature-name.module.ts
├── feature-name.controller.ts
├── feature-name.service.ts
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
└── entities/ (if needed)
```

**Naming Conventions**
- Files: kebab-case (`task.controller.ts`)
- Classes: PascalCase (`TaskController`)
- Methods: camelCase (`findAll`, `create`)
- Endpoints: kebab-case (`/tasks`, `/task-lists`)

**DTOs**
- Use class-validator decorators
- Enable whitelist mode
- Use class-transformer for transforms
- Shared types in `common/dto/`

**Guards**
- Always apply `JwtAuthGuard` and `WorkspaceGuard` to workspace-scoped routes
- Use `@Roles()` decorator for role-based access
- Use `@RequireFeature()` for plan gating

**Database Queries**
- Always include `workspaceId` in `where` clause
- Use Prisma typed client
- For complex queries, consider repository pattern

**Example Service**
```typescript
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string, filters: TaskFilters) {
    return this.prisma.task.findMany({
      where: { workspaceId, deletedAt: null, ...filters },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

### Frontend (React)

**Feature-Sliced Design**
```
src/features/feature-name/
├── api.ts              # Typed API calls
├── hooks.ts            # TanStack Query hooks
├── components/         # Feature components
├── pages/              # Feature pages
└── schemas.ts          # Zod validation
```

**State Management**
- Server state: TanStack Query
- Client state: Zustand
- Form state: React Hook Form + Zod
- Auth: Supabase context

**Component Organization**
- Shared UI in `components/`
- Feature-specific UI in `features/*/components/`
- Widgets in `widgets/`

**Naming Conventions**
- Files: PascalCase for components (`TaskList.tsx`), kebab-case for utilities (`api.ts`)
- Components: PascalCase (`TaskList`)
- Hooks: camelCase with `use` prefix (`useTasks`)
- Functions: camelCase (`fetchTasks`)

**Hooks Pattern**
```typescript
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

**Optimistic Updates**
- Use for quick actions (toggle, delete)
- Rollback on error
- Update local cache immediately

### Database (Prisma)

**Schema Conventions**
- Primary keys: `uuid` with `default gen_random_uuid()`
- Timestamps: `created_at`, `updated_at` as `timestamptz`
- Soft delete: `deleted_at` where recovery is needed
- Workspace scoping: All domain tables have `workspace_id`
- Indexes: Always index `workspace_id` as first column

**Migration Workflow**
1. Modify `schema.prisma`
2. Run `prisma migrate dev --name <description>`
3. Review generated SQL
4. Commit both schema and migration

**Seeding**
- Seed script in `prisma/seed.ts`
- Populates: module_catalog, widget_catalog, role_templates
- Run with `prisma db seed`

---

## Feature Development Workflow

### 1. Understand Requirements

- Read the relevant section in [Tasks_Plan.md](../../Tasks_Plan.md)
- Check the current phase
- Identify the specific requirement (FR-ID)

### 2. Review Existing Code

- Find similar existing features to understand patterns
- Read the relevant API endpoints in [API_Plan.md](../../API_Plan.md)
- Check the schema in [Schema_Plan.md](../../Schema_Plan.md)

### 3. Backend Implementation

**Order of operations:**
1. Add/update Prisma schema (if needed)
2. Generate migration
3. Create/update DTOs
4. Implement service with business logic
5. Implement controller with guards
6. Add Swagger documentation
7. Write unit tests for service
8. Write e2e tests for API

**Checklist:**
- [ ] Workspace guard applied
- [ ] Role guard applied (if needed)
- [ ] Feature guard applied (if needed)
- [ ] All queries include `workspaceId`
- [ ] DTO validation with whitelist
- [ ] Swagger decorators added
- [ ] Error handling follows convention
- [ ] Tests include cross-workspace denial

### 4. Frontend Implementation

**Order of operations:**
1. Create/update Zod schema (matches DTO)
2. Create API functions in `api.ts`
3. Create TanStack Query hooks in `hooks.ts`
4. Create components
5. Create pages
6. Add routes
7. Write component tests
8. Write e2e tests

**Checklist:**
- [ ] API functions typed
- [ ] Query keys follow convention
- [ ] Optimistic updates where appropriate
- [ ] Loading, empty, error states
- [ ] Responsive design
- [ ] Accessible (keyboard, screen reader)
- [ ] Form validation with Zod

### 5. Integration

- Test frontend with backend
- Verify data flow end-to-end
- Check performance (dashboard load, API response)
- Test on mobile if applicable

---

## Common Patterns

### CRUD Pattern

**Backend**
```typescript
// Controller
@Get()
findAll(@Param('workspaceId') workspaceId: string) {
  return this.service.findAll(workspaceId);
}

@Post()
create(@Param('workspaceId') workspaceId: string, @Body() dto: CreateDto) {
  return this.service.create(workspaceId, dto);
}

@Get(':id')
findOne(@Param('workspaceId') workspaceId: string, @Param('id') id: string) {
  return this.service.findOne(workspaceId, id);
}

@Patch(':id')
update(@Param('workspaceId') workspaceId: string, @Param('id') id: string, @Body() dto: UpdateDto) {
  return this.service.update(workspaceId, id, dto);
}

@Delete(':id')
remove(@Param('workspaceId') workspaceId: string, @Param('id') id: string) {
  return this.service.remove(workspaceId, id);
}
```

**Frontend**
```typescript
// hooks.ts
export const useItems = (workspaceId: string) => {
  return useQuery({
    queryKey: ['items', workspaceId],
    queryFn: () => itemsApi.list(workspaceId),
  });
};

export const useCreateItem = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemDto) => itemsApi.create(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['items', workspaceId]);
    },
  });
};
```

### Error Handling

**Backend**
```typescript
// Service
async remove(workspaceId: string, id: string) {
  const item = await this.prisma.item.findFirst({
    where: { id, workspaceId },
  });
  if (!item) {
    throw new NotFoundException('Item');
  }
  return this.prisma.item.delete({ where: { id } });
}
```

**Frontend**
```typescript
// Component
const { error } = useCreateItem(workspaceId);

useEffect(() => {
  if (error) {
    toast.error(error.message);
  }
}, [error]);
```

### Pagination

**Backend**
```typescript
// DTO
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  sort?: string = 'created_at';

  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';
}

// Service
async findAll(workspaceId: string, pagination: PaginationDto) {
  const { page, limit, sort, order } = pagination;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.item.findMany({
      where: { workspaceId },
      skip,
      take: limit,
      orderBy: { [sort]: order },
    }),
    this.prisma.item.count({ where: { workspaceId } }),
  ]);

  return { data, meta: { page, limit, total } };
}
```

---

## Testing Requirements

### Backend Tests

**Unit Tests (Jest)**
- Test business logic in services
- Test domain rules (workload, trends, feedback)
- Mock Prisma client
- Focus on edge cases

**E2E Tests (Supertest)**
- Test guard enforcement
- Test workspace isolation
- Test CRUD flows
- Use test database

**Mandatory:**
- Cross-workspace access denial for every module
- Role enforcement
- Plan limit enforcement

### Frontend Tests

**Component Tests (Vitest + RTL)**
- Test user interactions
- Test form validation
- Test conditional rendering
- Mock API calls

**E2E Tests (Playwright)**
- Test critical user flows
- Test authentication
- Test workspace switching
- Test dashboard customization

---

## Security Checklist

- [ ] Never trust `workspaceId` from request body (use route param)
- [ ] All Prisma queries include `workspaceId` filter
- [ ] Sensitive data never logged
- [ ] Secrets in env vars only
- [ ] File uploads via signed URLs only
- [ ] Input validation with whitelist
- [ ] CORS properly configured
- [ ] Rate limiting applied

---

## Performance Guidelines

### Backend
- Use indexes on `workspace_id` and frequently queried fields
- Use aggregated endpoints (e.g., `/dashboard/data`)
- Implement pagination for list endpoints
- Cache expensive computations
- Use connection pooling (PgBouncer)

### Frontend
- Code split routes
- Lazy load heavy components
- Use TanStack Query caching
- Implement optimistic updates
- Debounce expensive operations
- Use aggregated endpoint for dashboard

---

## Common Pitfalls to Avoid

1. **Skipping workspace scoping**: Always include `workspaceId` in queries
2. **Touching Prisma in controllers**: Keep controllers thin
3. **Not testing cross-workspace access**: Mandatory security test
4. **Reading entire files**: Use grep or read with limits
5. **Regenerating entire code**: Edit existing code instead
6. **Adding unnecessary comments**: Code should be self-documenting
7. **Ignoring error states**: Always handle loading, empty, and error states
8. **Hardcoding values**: Use environment variables or configuration
9. **Not following existing patterns**: Check similar features first
10. **Skipping documentation**: Update relevant docs after changes

---

## When to Ask for Clarification

Ask the user if:
- The requirement is ambiguous or missing details
- Multiple implementation approaches are possible
- A decision affects the architecture significantly
- Security implications are unclear
- Performance concerns are identified
- The requested change conflicts with existing patterns

---

## Quick Reference

### File Locations
- Backend modules: `apps/api/src/modules/`
- Frontend features: `apps/web/src/features/`
- Shared components: `apps/web/src/components/`
- Widgets: `apps/web/src/widgets/`
- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/`

### Common Commands
```bash
# Backend
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
pnpm test
pnpm test:e2e

# Frontend
cd apps/web
pnpm test
pnpm test:e2e
pnpm build

# Root
pnpm install
pnpm lint
```

### Environment Files
- Backend: `apps/api/.env`
- Frontend: `apps/web/.env`

---

**Remember**: Prioritize consistency with existing patterns over clever solutions. When in doubt, check the documentation and similar features.
