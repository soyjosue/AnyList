import { ArgsType, Field } from '@nestjs/graphql';
import { RoleEnum } from '../../../auth/enums/valid-roles.enum';
import { IsArray } from 'class-validator';

@ArgsType()
export class ValidRoleArgs {
  @Field(() => [RoleEnum], { nullable: true })
  @IsArray()
  roles: RoleEnum[] = [];
}
