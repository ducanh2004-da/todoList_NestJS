import { InputType, Field, GraphQLISODateTime, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsArray, IsString, MinLength, IsOptional, IsDateString, IsEnum, Max, MaxLength } from 'class-validator';

@InputType()
export class LoginUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}