import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
    constructor(private prisma: PrismaService){ }
    async showReport(){
        const [totalTask, totalTag, totalInProgress] = await Promise.all([
            this.prisma.task.count(),
            this.prisma.tag.count(),
            this.prisma.task.count({
                where: { status: "IN_PROGRESS" }
            }),
        ]);
        return{
            totalTask,
            totalInProgress,
            totalTag
        }
    }
}
