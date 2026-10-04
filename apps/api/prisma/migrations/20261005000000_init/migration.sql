-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE "TemplateKey" AS ENUM ('teacher', 'student', 'employee', 'freelancer', 'business', 'personal', 'custom');
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'done', 'archived');
CREATE TYPE "PriorityLevel" AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE "AssignmentStatus" AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE "TrendStatus" AS ENUM ('improving', 'consistent', 'needs_attention', 'significant_decline');
CREATE TYPE "GoalType" AS ENUM ('academic', 'professional', 'financial', 'personal', 'business');
CREATE TYPE "TxnType" AS ENUM ('income', 'expense', 'savings');
CREATE TYPE "PlanTier" AS ENUM ('free', 'premium', 'education', 'organization');

-- CreateTable profiles
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "primary_role" "TemplateKey",
    "locale" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Manila',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable workspaces
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template" "TemplateKey" NOT NULL DEFAULT 'custom',
    "icon" TEXT,
    "color" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "organization_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable workspace_members
CREATE TABLE "workspace_members" (
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("workspace_id", "user_id"),
    CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable module_catalog
CREATE TABLE "module_catalog" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "is_core" BOOLEAN NOT NULL DEFAULT false,
    "min_tier" "PlanTier" NOT NULL DEFAULT 'free'
);

-- CreateTable widget_catalog
CREATE TABLE "widget_catalog" (
    "type" TEXT NOT NULL PRIMARY KEY,
    "module_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "default_w" INTEGER NOT NULL DEFAULT 2,
    "default_h" INTEGER NOT NULL DEFAULT 2,
    "min_w" INTEGER NOT NULL DEFAULT 1,
    "min_h" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable role_templates
CREATE TABLE "role_templates" (
    "key" "TemplateKey" NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "default_modules" JSONB NOT NULL,
    "default_widgets" JSONB NOT NULL,
    "priority_topic" TEXT
);

-- CreateTable workspace_modules
CREATE TABLE "workspace_modules" (
    "workspace_id" TEXT NOT NULL,
    "module_key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "enabled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("workspace_id", "module_key"),
    CONSTRAINT "workspace_modules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_modules_module_key_fkey" FOREIGN KEY ("module_key") REFERENCES "module_catalog" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable dashboard_widgets
CREATE TABLE "dashboard_widgets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspace_id" TEXT NOT NULL,
    "widget_type" TEXT NOT NULL,
    "title" TEXT,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "w" INTEGER NOT NULL DEFAULT 2,
    "h" INTEGER NOT NULL DEFAULT 2,
    "position" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dashboard_widgets_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dashboard_widgets_widget_type_fkey" FOREIGN KEY ("widget_type") REFERENCES "widget_catalog" ("type") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "workspaces_owner_id_idx" ON "workspaces"("owner_id");
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");
CREATE INDEX "dashboard_widgets_workspace_id_idx" ON "dashboard_widgets"("workspace_id");
