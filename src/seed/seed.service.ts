import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private readonly isProd: boolean;

  constructor(
    @InjectRepository(Item)
    private readonly _itemRepository: Repository<Item>,
    private readonly _itemService: ItemsService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _userService: UsersService,
    configService: ConfigService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('We cannot run SEED on PROD.');

    await this.deleteDatabase();

    const users = await this.loadUsers();

    await this.loadItems(users);

    return true;
  }

  async deleteDatabase() {
    await this._itemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this._userRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User[]> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this._userService.create(user));
    }

    return users;
  }

  async loadItems(users: User[]): Promise<void> {
    for (const item of SEED_ITEMS) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await this._itemService.create(item, randomUser);
    }
  }
}
