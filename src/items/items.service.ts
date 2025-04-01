import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SeachArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly _itemRepository: Repository<Item>,
  ) {}

  async findAll(
    user: User,
    { limit, offset }: PaginationArgs,
    { seach }: SeachArgs,
  ): Promise<Item[]> {
    const queryBuilder = this._itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (seach) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${seach.toLocaleLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this._itemRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found.`);

    return item;
  }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this._itemRepository.create({
      ...createItemInput,
      user,
    });
    return await this._itemRepository.save(newItem);
  }

  async update(
    id: string,
    { name, quantityUnits }: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    const item = await this.findOne(id, user);

    if (name) item.name = name;
    if (quantityUnits) item.quantityUnits = quantityUnits;

    return await this._itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    await this._itemRepository.remove(item);

    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this._itemRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
