import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({
      ...createItemInput,
      user,
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: {
        id,
      },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found.`);

    return item;
  }

  async update(
    id: string,
    { name, quantityUnits }: UpdateItemInput,
  ): Promise<Item> {
    const item = await this.findOne(id);

    if (name) item.name = name;
    if (quantityUnits) item.quantityUnits = quantityUnits;

    return await this.itemRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);

    await this.itemRepository.remove(item);

    return { ...item, id };
  }
}
