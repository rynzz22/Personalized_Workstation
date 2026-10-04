import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user || {
      id: 'usr-dev-01',
      email: 'labradarenz@gmail.com',
      fullName: 'Enzo Labrador',
    };
    return data ? user?.[data] : user;
  }
);
