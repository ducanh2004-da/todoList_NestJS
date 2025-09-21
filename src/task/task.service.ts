import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput } from '../models/createTask.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async findAll(pageSize: number, currentPage: number, userId: number) {
        const [totalTask, tasks] = await Promise.all([
            this.prisma.task.count({
                where: { userId }
            }),
            this.prisma.task.findMany({
                where: { userId },
                skip: (currentPage - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    // LẤY đủ fields tag để trả TagResponse object
                    tags: {}
                }
            })
        ]);

        const totalPages = Math.max(1, Math.ceil(totalTask / pageSize));

        // đảm bảo tags là mảng object (không trả mảng string)
        const items = tasks.map(t => ({
            ...t,
            tags: Array.isArray((t as any).tags) ? (t as any).tags : []
        }));

        return {
            totalTask,
            totalPage: totalPages,
            items
        };
    }
    async findByEmail(PageSize: number, CurrentPage: number, title: string, userId: number) {
        const [totalTask, tasks] = await Promise.all([
            this.prisma.task.count({
                where: {
                    ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
                    userId
                }
            }),
            this.prisma.task.findMany({
                where: {
                    ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
                    userId
                },
                skip: (CurrentPage - 1) * PageSize,
                take: PageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    tags: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            taskId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            })
        ]);

        const totalPages = Math.max(1, Math.ceil(totalTask / PageSize));
        const items = tasks.map(t => ({
            ...t,
            tags: Array.isArray((t as any).tags) ? (t as any).tags : []
        }));

        return {
            totalTask,
            totalPage: totalPages,
            items
        };
    }
    async add(dto: CreateTaskInput, userId: number) {
        const result = {
            message: '',
            data: {}
        }
        const checkExist = await this.prisma.task.findFirst({
            where: {
                title: dto.title
            }
        })
        if (checkExist) {
            result.message = "Task is exists";
            throw new BadRequestException(result.message);
        }
        const addRC = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                dueAt: dto.dueAt,
                status: dto.status,
                userId: userId,
                tags: dto.tags && dto.tags.length > 0
                    ? {
                        create: dto.tags.map(t => ({
                            title: t
                        }))
                    }
                    : undefined
            },
            include: { tags: true }
        })
        result.data = addRC;
        result.message = "Add task successfully"
        return result;
    }
    async edit(taskId: number, dto: CreateTaskInput) {
        const result = {
            message: '',
            data: {}
        }
        const getTask = await this.prisma.task.findFirst({
            where: {
                id: taskId
            }
        });
        if (!getTask) {
            result.message = "Task is not exists";
            throw new BadRequestException(result.message);
        }
        const task = await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...dto,
                tags: dto.tags && dto.tags.length > 0
                    ? {
                        create: dto.tags.map(t => ({ title: t }))
                    }
                    : undefined
            }
        });
        result.data = task;
        result.message = "Edit task successfully";
        return result;
    }
    async delete(taskId: number) {
        const result = {
            message: '',
            data: {}
        }
        const findTask = await this.prisma.task.findFirst({
            where: {
                id: taskId
            }
        })
        if (!findTask) {
            result.message = "Task is not exists";
            throw new BadRequestException(result.message);
        }
        const deleteRC = await this.prisma.task.delete({
            where: {
                id: taskId
            }
        })
        result.data = deleteRC;
        result.message = "Delete task successfully";
        return result;
    }
}
