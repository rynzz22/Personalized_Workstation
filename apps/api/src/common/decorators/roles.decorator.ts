import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (MemberRole | string)[]) => SetMetadata(ROLES_KEY, roles);

export const FEATURE_KEY = 'required_feature';
export const RequireFeature = (featureKey: string) => SetMetadata(FEATURE_KEY, featureKey);
