import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskResponse } from './taskResponse.dto';

@ObjectType()
export class ReturnResult {
    @Field(() => String)
    message: string;

    @Field(() => TaskResponse, {nullable: true})
    data: TaskResponse | null;
}
