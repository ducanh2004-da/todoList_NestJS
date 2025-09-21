import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResponse } from './userResponse.dto';

@ObjectType()
export class UserPagination {
    @Field(() => Int, { nullable: true })
    totalTask: number;

    @Field(() => Int, { nullable: true })
    totalPage: number;

    @Field(() => [UserResponse], { nullable: true })
    items?: UserResponse[] | null;
}
