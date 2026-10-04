# Contributing to Talibon Workspace

Thank you for contributing to Talibon Workspace! This document provides guidelines for contributing to both the backend (NestJS) and frontend (React) services.

## Architecture Guidelines

### Backend (NestJS in `apps/api`)
- **Layering**: Controller → Service → Prisma
- **Workspace Scoping**: Every domain table has `workspace_id` foreign key. All queries MUST filter by `workspaceId`.
- **Validation**: Use class-validator DTOs on all endpoints.
- **Documentation**: Annotate controller methods with `@ApiOperation()`, `@ApiTags()`, and `@ApiBearerAuth()`.
- **Error Handling**: Use standard NestJS HttpExceptions (`NotFoundException`, `ForbiddenException`, `UnauthorizedException`). They are automatically formatted by `AllExceptionsFilter`.
- **Responses**: Responses are automatically wrapped in `{ data, meta }` envelopes by `ResponseInterceptor`.

### Frontend (React in `apps/web`)
- **Structure**: Feature-sliced design (`src/features/`) and UI primitives (`src/components/ui/`).
- **Server State**: Managed via TanStack Query.
- **Client State**: Managed via Zustand.
- **Styling**: Tailwind CSS with design tokens.
- **Widgets**: Register new dashboard tiles in `src/widgets/registry.ts`.

## Commit Conventions

Follow Conventional Commits:
- `feat: add lesson plan duplication endpoint`
- `fix: resolve task status toggle optimistic rollback`
- `docs: update API endpoints table in API_Plan.md`
- `chore: bump dependencies in package.json`
