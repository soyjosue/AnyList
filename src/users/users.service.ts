import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserInput: CreateUserInput): Promise<User> {
    return new User();
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    return new User();
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    return new User();
  }

  async block(id: string): Promise<User> {
    return new User();
  }
}
