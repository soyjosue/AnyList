import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}
