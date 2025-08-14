import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserInterface } from 'src/interfaces/request-with-user.interface';

export const User = createParamDecorator(
  (data: { skip: string[] }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserInterface>();

    if (data.skip?.length > 0) {
      return Object.fromEntries(
        Object.entries(request.user || {}).filter(
          ([key]) => !data.skip?.includes(key),
        ),
      );
    }

    return request.user;
  },
);
