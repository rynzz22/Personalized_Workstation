import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;
    const match = typeof header === 'string' && /^Bearer (\S+)$/i.exec(header);
    if (!match) throw new UnauthorizedException('Bearer token required');
    const user = await this.supabaseService.verifyToken(match[1]);
    if (!user) throw new UnauthorizedException('Invalid or expired session');
    request.user = user;
    return true;
  }
}
