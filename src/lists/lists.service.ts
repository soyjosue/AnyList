import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SeachArgs } from '../common/dto/args/seach.args';
import { DatabaseError } from 'pg';
import { CreateListInput, UpdateListInput } from './dto/inputs';

@Injectable()
export class ListsService {
  private readonly _logger: Logger = new Logger('ListsService');

  constructor(
    @InjectRepository(List)
    private readonly _listRepository: Repository<List>,
  ) {}

  findAll(
    user: User,
    { limit, offset }: PaginationArgs,
    { seach }: SeachArgs,
  ): Promise<List[]> {
    try {
      const queryBuilder = this._listRepository
        .createQueryBuilder()
        .where('"userId" = :userId', {
          userId: user.id,
        })
        .take(limit)
        .skip(offset);

      if (seach) {
        queryBuilder.andWhere('LOWER("name") = :name', {
          name: `%${seach.toLocaleLowerCase()}%`,
        });
      }

      return queryBuilder.getMany();
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findOne(id: string, user: User): Promise<List> {
    try {
      const list = await this._listRepository.findOne({
        where: {
          id,
          user: {
            id: user.id,
          },
        },
      });

      if (!list) throw new NotFoundException(`List with ID ${id} not found.`);

      return list;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async countByUser(user: User): Promise<number> {
    return this._listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this._listRepository.create({
      ...createListInput,
      user: user,
    });

    return await this._listRepository.save(list);
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    const list = await this._listRepository.preload({
      ...updateListInput,
      id: id,
    });

    if (!list || list.user.id !== user.id)
      throw new NotFoundException(`List with ID ${id} not found.`);

    return await this._listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const item = await this.findOne(id, user);

    await this._listRepository.remove(item);

    return { ...item, id };
  }

  private handleErrors(error: unknown): never {
    if (error instanceof HttpException) throw error;

    if (error instanceof QueryFailedError) {
      if (error.driverError instanceof DatabaseError) {
        switch (error.driverError.code) {
          case '23505':
            throw new BadRequestException(error.driverError.detail);
        }
      }
    }

    this._logger.error(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
