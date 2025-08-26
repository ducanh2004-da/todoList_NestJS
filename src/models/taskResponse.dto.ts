import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';

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
}
