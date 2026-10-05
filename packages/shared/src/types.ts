import {
  MemberRole,
  TemplateKey,
} from './enums';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    requestId?: string;
  };
}

export interface ProfileDto {
  id: string;
  fullName: string;
  avatarUrl?: string;
  primaryRole?: TemplateKey;
  locale: string;
  timezone: string;
  createdAt: string;
}

export interface WorkspaceDto {
  id: string;
  ownerId: string;
  name: string;
  template: TemplateKey;
  icon?: string;
  color?: string;
  currency: string;
  createdAt: string;
}

export interface WorkspaceMemberDto {
  workspaceId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user?: ProfileDto;
}
