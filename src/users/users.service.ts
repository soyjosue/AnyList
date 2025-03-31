import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DatabaseError } from 'pg';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { RoleEnum } from './../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/UpdateUserInput.dto';

@Injectable()
export class UsersService {
  private readonly _logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {}

  async findAll(roles: RoleEnum[]): Promise<User[]> {
    if (roles.length === 0) return await this._userRepository.find();

    return this._userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this._userRepository.findOneBy({
        email,
      });

      if (!user)
        throw new BadRequestException(`User with email ${email} not found.`);

      return user;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this._userRepository.findOneBy({
        id,
      });

      if (!user) throw new BadRequestException(`User with id ${id} not found.`);

      return user;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this._userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this._userRepository.save(newUser);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this._userRepository.save(userToBlock);
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const userToUpdate = await this._userRepository.preload({
        ...updateUserInput,
        id,
      });

      if (!userToUpdate)
        throw new NotFoundException(`User with ID ${id} not found.`);

      userToUpdate.lastUpdateBy = adminUser;

      return await this._userRepository.save(userToUpdate);
    } catch (error) {
      this.handleErrors(error);
    }
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
