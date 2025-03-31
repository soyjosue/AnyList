import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this._usersService.create(signupInput);

    const token = await this.generateJWT({ id: user.id });

    return {
      token,
      user,
    };
  }

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this._usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email/Password do not match.');
    }

    const token = await this.generateJWT({ id: user.id });

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this._usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin.');

    return {
      ...user,
      password: '',
    };
  }

  async revalidateToken(user: User): Promise<AuthResponse> {
    const token = await this.generateJWT({ id: user.id });

    return {
      token,
      user,
    };
  }

  private async generateJWT(payload: JwtPayload): Promise<string> {
    return await this._jwtService.signAsync(payload);
  }
}
