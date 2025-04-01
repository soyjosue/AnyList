import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Field(() => Number, { nullable: true })
  quantity: number = 0;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  completed: boolean = false;

  @IsUUID()
  @Field(() => ID)
  listId: string;

  @IsUUID()
  @Field(() => ID)
  itemId: string;
}
