import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './../users/entities/user.entity';
import { Public } from './decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthResponse, { name: 'revalidate' })
  revalidateToken(
    @CurrentUser(/*[Roles.admin]*/) user: User,
  ): Promise<AuthResponse> {
    return this.authService.revalidateToken(user);
  }

  @Public()
  @Mutation(() => AuthResponse, { name: 'signup' })
  signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signUp(signupInput);
  }

  @Public()
  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('login') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }
}
