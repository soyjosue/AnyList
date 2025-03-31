import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { RoleEnum } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);

    const requiredRoles = this._reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [gqlCtx.getHandler(), gqlCtx.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = gqlCtx.getContext<{ req: Request }>().req;
    return requiredRoles.some((role) => (user as User).roles?.includes(role));
  }
}
