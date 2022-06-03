import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserRest = createParamDecorator(
  (data: string | undefined, input: ExecutionContext) => {
    const request = input.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

export const CurrentUserGraphQl = createParamDecorator(
  (data, input: ExecutionContext) => {
    const { sub, accessToken } =
      GqlExecutionContext.create(input).getContext().req.user;
    return { sub, accessToken };
  },
);
