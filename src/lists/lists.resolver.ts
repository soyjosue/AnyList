import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SeachArgs } from 'src/common/dto/args';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateListInput, UpdateListInput } from './dto/inputs';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List, { name: 'createList' })
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, currentUser);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() seachArgs: SeachArgs,
    @CurrentUser() currentUser: User,
  ): Promise<List[]> {
    return this.listsService.findAll(currentUser, paginationArgs, seachArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return this.listsService.findOne(id, currentUser);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return this.listsService.update(
      updateListInput.id,
      updateListInput,
      currentUser,
    );
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.listsService.remove(id, currentUser);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(@Parent() list: List): Promise<ListItem[]> {
    return this.listItemsService.findAll();
  }
}
