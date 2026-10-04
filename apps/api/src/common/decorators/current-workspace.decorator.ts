import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentWorkspace = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const workspace = request.workspace || {
      id: request.params?.workspaceId || 'ws-teacher-01',
      name: 'Ms. Santos — Science Dept',
      role: 'owner',
    };
    return data ? workspace?.[data] : workspace;
  }
);
