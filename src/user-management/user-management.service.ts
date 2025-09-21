import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UserManagementService {
    constructor(private prisma: PrismaService){}
    async findAll(pageSize: number, currentPage: number){
        const [totalUser, users] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                skip: (currentPage - 1) * pageSize,
                take: pageSize,
                orderBy: {createdAt: 'desc'}
            })
        ])
        const totalPages = Math.max(1, Math.ceil(totalUser/pageSize));
        return{
            totalUser,
            totalPages,
            items: users
        };
    }
    async findById(userId: number){
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
            include: {
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            }
        })
        return user;
    }
    async deleteUser(userId: number){
        const result = {
            message: '',
            data: {}
        }
        const user = await this.prisma.user.findFirst({
            where: {id: userId}
        })
        if(!user){
            result.message = 'User not exist';
            throw new BadRequestException(result.message);
        }
        const deleteRC = await this.prisma.user.delete({
            where: {id: userId}
        });
        result.data = deleteRC;
        result.message = "Delete Successfully";
        return result;
    }
}
