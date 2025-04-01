import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { RoleEnum } from './../auth/enums/valid-roles.enum';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRoleArgs } from './dto/args';
import { Roles } from './../auth/decorators/roles.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/inputs/UpdateUserInput.dto';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs, SeachArgs } from 'src/common/dto/args';
import { Item } from 'src/items/entities/item.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _itemsService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  @Roles(RoleEnum.admin, RoleEnum.superUser)
  findAll(
    @Args() roles: ValidRoleArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SeachArgs,
  ): Promise<User[]> {
    return this._usersService.findAll(roles.roles, paginationArgs, searchArgs);
  }

  @Query(() => User, { name: 'user' })
  @Roles(RoleEnum.user)
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this._usersService.findOneById(id);
  }

  @Roles(RoleEnum.admin)
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this._usersService.block(id, currentUser);
  }

  @Roles(RoleEnum.admin)
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this._usersService.update(
      updateUserInput.id,
      updateUserInput,
      currentUser,
    );
  }

  @Roles(RoleEnum.admin)
  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(@Parent() user: User): Promise<number> {
    return this._itemsService.itemCountByUser(user);
  }

  @Roles(RoleEnum.admin)
  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() seachArgs: SeachArgs,
  ): Promise<Item[]> {
    return this._itemsService.findAll(user, paginationArgs, seachArgs);
  }
}
