import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || null;
  },
);
