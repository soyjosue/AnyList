import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field(() => [RoleEnum], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles?: RoleEnum[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
