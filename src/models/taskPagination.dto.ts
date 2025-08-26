import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskResponse } from './taskResponse.dto';

@ObjectType()
export class TaskPagination {
    @Field(() => Int)
    totalTask: number;

    @Field(() => Int)
    totalPage: number;

    @Field(() => [TaskResponse], { nullable: true })
    items?: TaskResponse[] | null;
}
