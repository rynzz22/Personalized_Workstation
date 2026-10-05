import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, FEATURE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.member?.role || ''; 

    const roleHierarchy: Record<string, number> = {
      viewer: 1,
      member: 2,
      admin: 3,
      owner: 4,
    };

    const userLevel = roleHierarchy[userRole.toLowerCase()] || 0;
    const hasRole = requiredRoles.some(
      (role) => userLevel >= (roleHierarchy[role.toLowerCase()] || Infinity)
    );

    if (!hasRole) {
      throw new ForbiddenException({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `Requires one of [${requiredRoles.join(', ')}] role`,
      });
    }

    return true;
  }
}

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeature = this.reflector.getAllAndOverride<string>(FEATURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredFeature) {
      return true;
    }

    // Phase 0 / MVP: Free tier unlocks core features
    return true;
  }
}
