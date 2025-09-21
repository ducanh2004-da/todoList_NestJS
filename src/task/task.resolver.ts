import { TaskResponse } from '../models/taskResponse.dto';
import { TaskPagination } from '../models/taskPagination.dto';
import { CreateTaskInput } from '../models/createTask.dto';
import { TaskService } from './task.service';
import { ReturnResult } from '../models/returnResult.dto';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => TaskResponse)
export class TaskResolver {
    constructor(private taskService: TaskService){}

    @Query(() => TaskPagination, {name: 'tasks'})
    @UseGuards(GqlAuthGuard)
    async findAllTask(@Args('userId', { type: () => Number }) userId: number, @Args('currentPage', { type: () => Number }) currentPage: number){
        const pageSize = 5;
        const result = this.taskService.findAll(pageSize, currentPage,userId);
        return result;
    }

    @Mutation(() => ReturnResult)
    @UseGuards(GqlAuthGuard)
    async addTask(@Args('userId', { type: () => Number }) userId: number, @Args('data') data:CreateTaskInput){
        return this.taskService.add(data,userId);
    }
    @Mutation(() => ReturnResult)
    @UseGuards(GqlAuthGuard)
    async editTask(@Args('id', { type: () => Number }) id: number, @Args('data') data: CreateTaskInput) {
        return this.taskService.edit(id, data);
    }

    @Mutation(() => ReturnResult)
    @UseGuards(GqlAuthGuard)
    async deleteTask(@Args('id', { type: () => Number }) id: number) {
        return this.taskService.delete(id);
    }
    @Mutation(() => TaskPagination)
    @UseGuards(GqlAuthGuard)
    async search(@Args('userId', { type: () => Number }) userId: number, @Args('title', { type: () => String }) title: string) {
        const PageSize = 6;
        const CurrentPage = 1;
        const result = this.taskService.findByEmail(PageSize, CurrentPage, title, userId);
        return result;
    }
}
