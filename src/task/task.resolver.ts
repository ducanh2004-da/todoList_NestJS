import { TaskResponse } from '../models/taskResponse.dto';
import { TaskPagination } from '../models/taskPagination.dto';
import { CreateTaskInput } from '../models/createTask.dto';
import { TaskService } from './task.service';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

@Resolver(() => TaskResponse)
export class TaskResolver {
    constructor(private taskService: TaskService){}

    @Query(() => TaskPagination, {name: 'tasks'})
    async findAllTask(){
        const pageSize = 5;
        const currentPage = 1;
        const result = this.taskService.findAll(pageSize, currentPage);
        return result;
    }

    @Mutation(() => TaskResponse)
    async addTask(@Args('data') data:CreateTaskInput){
        return this.taskService.add(data);
    }
}
