import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
