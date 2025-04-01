import { Injectable } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly _listItemRepository: Repository<ListItem>,
  ) {}

  create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this._listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    return this._listItemRepository.save(newListItem);
  }

  async findAll(): Promise<ListItem[]> {
    return this._listItemRepository.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
