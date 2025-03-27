import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => null, { name: 'signUp' })
  signUp(): Promise<void> {
    return this.authService.signUp();
  }

  @Mutation(() => null, { name: 'login' })
  login(): Promise<void> {
    return this.authService.login();
  }

  @Query(???, { name: 'revalidate' })
}
