import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleEnum } from './../auth/enums/valid-roles.enum';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRoleArgs } from './dto/args';
import { Roles } from './../auth/decorators/roles.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/inputs/UpdateUserInput.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @Roles(RoleEnum.admin, RoleEnum.superUser)
  findAll(@Args() roles: ValidRoleArgs): Promise<User[]> {
    return this.usersService.findAll(roles.roles);
  }

  @Query(() => User, { name: 'user' })
  @Roles(RoleEnum.user)
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Roles(RoleEnum.admin)
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this.usersService.block(id, currentUser);
  }

  @Roles(RoleEnum.admin)
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      currentUser,
    );
  }

  // @Mutation(() => User)
  // createUser() // @Args2('createUserInput') createUserInput: CreateUserInput
  // : Promise<User> {
  //   return this.usersService.create(new SignupInput());
  // }
}
