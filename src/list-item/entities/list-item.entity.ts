import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('numeric')
  @Field(() => Number)
  quantity: number;

  @Column('boolean')
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, {
    lazy: true,
    nullable: false,
  })
  @Field(() => List)
  @Index('listItemId-list-index')
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, {
    lazy: true,
    nullable: false,
  })
  @Index('listItemId-item-index')
  @Field(() => Item)
  item: Item;
}
