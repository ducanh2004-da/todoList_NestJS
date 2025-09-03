import { TaskResponse } from '../models/taskResponse.dto';
import { TaskPagination } from '../models/taskPagination.dto';
import { CreateTaskInput } from '../models/createTask.dto';
import { TaskService } from './task.service';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

@Resolver(() => TaskResponse)
export class TaskResolver {
    constructor(private taskService: TaskService){}

    @Query(() => TaskPagination, {name: 'tasks'})
    async findAllTask(@Args('currentPage', { type: () => Number }) currentPage: number){
        const pageSize = 5;
        const result = this.taskService.findAll(pageSize, currentPage);
        return result;
    }

    @Mutation(() => TaskResponse)
    async addTask(@Args('data') data:CreateTaskInput){
        return this.taskService.add(data);
    }
    @Mutation(() => TaskResponse)
    async editTask(@Args('id', { type: () => Number }) id: number, @Args('data') data: CreateTaskInput) {
        return this.taskService.edit(id, data);
    }

    @Mutation(() => TaskResponse)
    async deleteTask(@Args('id', { type: () => Number }) id: number) {
        return this.taskService.delete(id);
    }
    @Mutation(() => TaskPagination)
    async search(@Args('title', { type: () => String }) title: string) {
        const PageSize = 6;
        const CurrentPage = 1;
        const result = this.taskService.findByEmail(PageSize, CurrentPage, title);
        return result;
    }
}
