// src/auth/dto/create-user.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsInt } from 'class-validator';
import { CreateTaskInput } from './createTask.dto';

@InputType()
export class CreateTagInput {
    @Field()
    @IsString()
    title: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(3)
    description?: string;
}
