import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { RoleEnum } from '../enums/valid-roles.enum';
import { User } from './../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: RoleEnum[] = [], context: ExecutionContext) => {
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    const user: User = ctx.getContext<{ req: Request }>().req.user as User;

    if (!user)
      throw new InternalServerErrorException(
        'No user inside the request - make sure thath we used the AuthGuard.',
      );

    if (roles.length === 0) return user;

    for (const role of user.roles) if (roles.includes(role)) return user;

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles.join(',')}]`,
    );
  },
);
