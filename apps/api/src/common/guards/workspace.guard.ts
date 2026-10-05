import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params?.workspaceId;
    if (!workspaceId) return true;
    if (!request.user?.id) throw new UnauthorizedException();
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: request.user.id } },
      include: { workspace: true },
    });
    if (!member || member.workspace.deletedAt) throw new NotFoundException('Workspace not found');
    if (member.role === 'viewer' && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) throw new ForbiddenException('This workspace is read-only');
    request.member = member;
    request.workspace = member.workspace;
    return true;
  }
}
