import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { TagResponse } from './tagResponse.dto';

// Bỏ aiId khỏi response nếu không cần hiển thị
@ObjectType()
export class TaskResponse {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueAt?: Date;

  @Field({ nullable: true })
  status?: string;

  @Field(() => [TagResponse], { nullable: 'itemsAndList' })
  tags?: TagResponse[] | null;
}
