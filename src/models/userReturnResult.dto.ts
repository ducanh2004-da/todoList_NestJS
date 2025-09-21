import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResponse } from './userResponse.dto';

@ObjectType()
export class UserReturnResult {
    @Field(() => String)
    message: string;

    @Field(() => UserResponse, {nullable: true})
    data: UserResponse | null;
}
