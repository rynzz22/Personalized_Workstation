-- CreateTable
CREATE TABLE "public"."dashboard_settings" (
    "workspace_id" TEXT NOT NULL,
    "priority_topic" TEXT,
    "layout_mode" TEXT NOT NULL DEFAULT 'grid',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_settings_pkey" PRIMARY KEY ("workspace_id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'todo',
    "priority" "public"."PriorityLevel" NOT NULL DEFAULT 'medium',
    "due_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "estimated_minutes" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "assignee_id" TEXT,
    "milestone_id" TEXT,
    "project_id" TEXT,
    "goal_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notes" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "category_id" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."calendar_events" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "recurrence" TEXT,
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."goals" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'personal',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "target_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."milestones" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "schedule" TEXT,
    "room" TEXT,
    "academic_period" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "guardian" TEXT,
    "trend" "public"."TrendStatus" NOT NULL DEFAULT 'consistent',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class_students" (
    "class_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_students_pkey" PRIMARY KEY ("class_id","student_id")
);

-- CreateTable
CREATE TABLE "public"."lesson_plans" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "template_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "objectives" JSONB NOT NULL DEFAULT '[]',
    "materials" JSONB NOT NULL DEFAULT '[]',
    "procedure" JSONB NOT NULL DEFAULT '[]',
    "assessment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subjects" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "color" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignments" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "subject_id" TEXT,
    "title" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "priority" "public"."PriorityLevel" NOT NULL DEFAULT 'medium',
    "estimated_hours" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'todo',
    "group_name" TEXT NOT NULL DEFAULT 'today',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "min_stock" INTEGER NOT NULL DEFAULT 5,
    "cost_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "items_desc" TEXT NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "public"."TxnType" NOT NULL DEFAULT 'expense',
    "category" TEXT NOT NULL DEFAULT 'general',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracker_definitions" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "target_daily" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tracker_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracker_records" (
    "id" TEXT NOT NULL,
    "tracker_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracker_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."note_categories" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_workspace_id_idx" ON "public"."tasks"("workspace_id");

-- CreateIndex
CREATE INDEX "tasks_workspace_id_status_idx" ON "public"."tasks"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "notes_workspace_id_idx" ON "public"."notes"("workspace_id");

-- CreateIndex
CREATE INDEX "calendar_events_workspace_id_idx" ON "public"."calendar_events"("workspace_id");

-- CreateIndex
CREATE INDEX "goals_workspace_id_idx" ON "public"."goals"("workspace_id");

-- CreateIndex
CREATE INDEX "milestones_goal_id_idx" ON "public"."milestones"("goal_id");

-- CreateIndex
CREATE INDEX "classes_workspace_id_idx" ON "public"."classes"("workspace_id");

-- CreateIndex
CREATE INDEX "students_workspace_id_idx" ON "public"."students"("workspace_id");

-- CreateIndex
CREATE INDEX "lesson_plans_workspace_id_idx" ON "public"."lesson_plans"("workspace_id");

-- CreateIndex
CREATE INDEX "subjects_workspace_id_idx" ON "public"."subjects"("workspace_id");

-- CreateIndex
CREATE INDEX "assignments_workspace_id_idx" ON "public"."assignments"("workspace_id");

-- CreateIndex
CREATE INDEX "products_workspace_id_idx" ON "public"."products"("workspace_id");

-- CreateIndex
CREATE INDEX "customers_workspace_id_idx" ON "public"."customers"("workspace_id");

-- CreateIndex
CREATE INDEX "orders_workspace_id_idx" ON "public"."orders"("workspace_id");

-- CreateIndex
CREATE INDEX "transactions_workspace_id_idx" ON "public"."transactions"("workspace_id");

-- CreateIndex
CREATE INDEX "tracker_definitions_workspace_id_idx" ON "public"."tracker_definitions"("workspace_id");

-- CreateIndex
CREATE INDEX "tracker_records_tracker_id_idx" ON "public"."tracker_records"("tracker_id");

-- CreateIndex
CREATE INDEX "note_categories_workspace_id_idx" ON "public"."note_categories"("workspace_id");

-- AddForeignKey
ALTER TABLE "public"."dashboard_settings" ADD CONSTRAINT "dashboard_settings_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."note_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calendar_events" ADD CONSTRAINT "calendar_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."milestones" ADD CONSTRAINT "milestones_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_students" ADD CONSTRAINT "class_students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_students" ADD CONSTRAINT "class_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subjects" ADD CONSTRAINT "subjects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tracker_definitions" ADD CONSTRAINT "tracker_definitions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tracker_records" ADD CONSTRAINT "tracker_records_tracker_id_fkey" FOREIGN KEY ("tracker_id") REFERENCES "public"."tracker_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."note_categories" ADD CONSTRAINT "note_categories_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Deny direct Data API access; the Nest API enforces membership.
ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."workspaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."workspace_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."module_catalog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."widget_catalog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."role_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."workspace_modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."dashboard_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."dashboard_widgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."calendar_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."goals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."milestones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."classes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."students" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."class_students" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."lesson_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."subjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tracker_definitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tracker_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."note_categories" ENABLE ROW LEVEL SECURITY;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX notes_title_trgm_idx ON public.notes USING gin (title gin_trgm_ops);
CREATE INDEX notes_body_trgm_idx ON public.notes USING gin (body gin_trgm_ops);
CREATE INDEX tasks_due_at_idx ON public.tasks (workspace_id, due_at) WHERE deleted_at IS NULL;
