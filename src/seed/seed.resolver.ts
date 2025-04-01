import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Resolver()
export class SeedResolver {
  constructor(private readonly _seedService: SeedService) {}

  @Public()
  @Mutation(() => Boolean, { name: 'executeSeed' })
  async executeSeed(): Promise<boolean> {
    return this._seedService.executeSeed();
  }
}
