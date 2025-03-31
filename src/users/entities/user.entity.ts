import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoleEnum } from 'src/auth/enums/valid-roles.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: [RoleEnum.user],
  })
  @Field(() => [String])
  roles: RoleEnum[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  // TODO: Relaciones
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
}
