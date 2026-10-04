export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum TemplateKey {
  TEACHER = 'teacher',
  STUDENT = 'student',
  EMPLOYEE = 'employee',
  FREELANCER = 'freelancer',
  BUSINESS = 'business',
  PERSONAL = 'personal',
  CUSTOM = 'custom',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ARCHIVED = 'archived',
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum AssignmentStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export enum TrendStatus {
  IMPROVING = 'improving',
  CONSISTENT = 'consistent',
  NEEDS_ATTENTION = 'needs_attention',
  SIGNIFICANT_DECLINE = 'significant_decline',
}

export enum GoalType {
  ACADEMIC = 'academic',
  PROFESSIONAL = 'professional',
  FINANCIAL = 'financial',
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVINGS = 'savings',
}

export enum PlanTier {
  FREE = 'free',
  PREMIUM = 'premium',
  EDUCATION = 'education',
  ORGANIZATION = 'organization',
}
