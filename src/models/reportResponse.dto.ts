import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class ReportResponse{
    @Field()
    totalTask: number;

    @Field()
    totalInProgress: number;

    @Field()
    totalTag: number;
}