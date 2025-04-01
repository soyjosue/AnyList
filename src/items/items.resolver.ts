import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Item } from './entities/item.entity';
import { ParseUUIDPipe } from '@nestjs/common';

import { ItemsService } from './items.service';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SeachArgs } from 'src/common/dto/args';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() seachArgs: SeachArgs,
    @CurrentUser() currentUser: User,
  ): Promise<Item[]> {
    return this.itemsService.findAll(currentUser, paginationArgs, seachArgs);
  }

  @Query(() => Item, { name: 'item' })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.findOne(id, currentUser);
  }

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return await this.itemsService.create(createItemInput, currentUser);
  }

  @Mutation(() => Item, { name: 'updateItem' })
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.update(
      updateItemInput.id,
      updateItemInput,
      currentUser,
    );
  }

  @Mutation(() => Item, { name: 'removeItem' })
  removeItem(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.remove(id, currentUser);
  }
}
