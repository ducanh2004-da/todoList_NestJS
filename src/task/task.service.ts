import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput } from '../models/createTask.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async findAll(pageSize: number, currentPage: number) {
        const [totalTask, tasks] = await Promise.all([
            this.prisma.task.count(),
            this.prisma.task.findMany({
                skip: (currentPage - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    // LẤY đủ fields tag để trả TagResponse object
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
    async findByEmail(PageSize: number, CurrentPage: number, title: string) {
        const [totalTask, tasks] = await Promise.all([
            this.prisma.task.count({ where: title ? { title: { contains: title, mode: 'insensitive' } } : {}}),
            this.prisma.task.findMany({
                where: title ? { title: { contains: title, mode: 'insensitive' } } : {},
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
    async add(dto: CreateTaskInput) {
        const checkExist = await this.prisma.task.findFirst({
            where: {
                title: dto.title
            }
        })
        if (checkExist) {
            throw new BadRequestException(`Task is exists`);
        }
        const addRC = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                dueAt: dto.dueAt,
                status: dto.status,
                tags: dto.tags && dto.tags.length > 0
                    ? {
                        create: dto.tags.map(t => ({ title: t }))
                    }
                    : undefined
            },
            include: { tags: true }  // <-- include tags so returned object has tags[]
        })
        return addRC;
    }
    async edit(taskId: number, dto: CreateTaskInput) {
        const getTask = await this.prisma.task.findFirst({
            where: {
                id: taskId
            }
        });
        if (!getTask) {
            throw new BadRequestException(`Task is not exists`);
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
        return task;
    }
    async delete(taskId: number) {
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
