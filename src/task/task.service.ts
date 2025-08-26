import { Injectable, ForbiddenException } from '@nestjs/common';
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
    async add(dto: CreateTaskInput){
        const checkExist = await this.prisma.task.findFirst({
            where: {
                title: dto.title
            }
        })
        if(checkExist){
            throw new ForbiddenException('Task is exist');
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
}
