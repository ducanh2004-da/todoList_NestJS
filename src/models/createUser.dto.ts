import { InputType, Field, GraphQLISODateTime, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsArray, IsString, MinLength, IsOptional, IsDateString, IsEnum, Max, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;
}