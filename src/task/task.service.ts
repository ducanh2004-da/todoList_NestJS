import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput } from '../models/createTask.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService){}

    async findAll(pageSize: number, currentPage: number){
        const [totalTask, tasks] = await Promise.all([
            this.prisma.task.count(),
            this.prisma.task.findMany({
                skip: (currentPage - 1)*pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' }, 
            })
        ]);
        const totalPages = Math.max(1, Math.ceil(totalTask / pageSize));
        return {
            totalTask: totalTask,
            totalPage: totalPages,
            items: tasks
        }
    }
    async findByEmail(PageSize: number, CurrentPage: number, title: string){
        const [totalTask, task] = await Promise.all([
            this.prisma.task.count({where: title ? {title:{contains: title, mode: 'insensitive'}} : {}}),
            this.prisma.task.findMany({
                where: title ? {title:{contains: title, mode: 'insensitive'}} : {},
                skip: (CurrentPage - 1)*PageSize,
                take: PageSize,
                orderBy: { createdAt: 'desc' }, 
            }),
        ]);
        const totalPages = Math.max(1, Math.ceil(totalTask / PageSize));
        return {
            totalTask: totalTask,
            totalPage: totalPages,
            items: task
        }
    }
    async add(dto: CreateTaskInput){
        const checkExist = await this.prisma.task.findFirst({
            where: {
                title: dto.title
            }
        })
        if(checkExist){
            throw new BadRequestException(`Task is not exists`);
        }
        const addRC = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                dueAt: dto.dueAt,
                status: dto.status
            }
        })
        return addRC;
    }
    async edit(taskId: number, dto: CreateTaskInput){
        const getTask = await this.prisma.task.findFirst({
            where: {
                id: taskId
            }
        });
        if(!getTask){
            throw new BadRequestException(`Task is not exists`);
        }
        const task = await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...dto
            }
        });
        return task;
    }
    async delete(taskId: number){
        const findTask = await this.prisma.task.findFirst({
            where: {
                id: taskId
            }
        })
        if (!findTask) {
            throw new BadRequestException(`Task is not exists`);
        }
        const result = await this.prisma.task.delete({
            where: {
                id: taskId
            }
        })
        return result;
    }
}
