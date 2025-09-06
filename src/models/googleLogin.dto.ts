import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GoogleLoginInput {
    @Field()
    email: string;
    @Field()
    googleId: string;
}