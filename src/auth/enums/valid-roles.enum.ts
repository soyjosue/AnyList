import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

registerEnumType(RoleEnum, {
  name: 'Roles',
  description: 'Roles validos',
});
