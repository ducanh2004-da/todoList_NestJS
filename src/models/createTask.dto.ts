// src/auth/dto/create-user.input.ts
import { InputType, Field, GraphQLISODateTime, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';

// đăng ký enum để GraphQL hiểu
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Status của Task',
});

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  title: string;

  // sử dụng GraphQLISODateTime để map DateTime scalar trong GraphQL
  @Field(() => GraphQLISODateTime)
  @IsDateString()
  dueAt: string; // input nhận chuỗi ISO date

  // thêm các field khác nếu cần
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  description: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
