import { Field, ObjectType } from '@nestjs/graphql';
import { TaskResponse } from './taskResponse.dto';

// Bỏ aiId khỏi response nếu không cần hiển thị
@ObjectType()
export class TagResponse {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Number, { nullable: true })
    taskId?: number;
}
