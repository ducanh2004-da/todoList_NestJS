import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTagInput } from '../models/createTag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService){}
    
        async findAll(){
            const tag = this.prisma.tag.findMany();
            if(!tag){
                throw new BadRequestException(`Tag is not exists`);
            }
            return tag;
        }
        async add(dto: CreateTagInput){
            const checkExist = await this.prisma.tag.findFirst({
                where: {
                    title: dto.title
                }
            })
            if(checkExist){
                throw new BadRequestException(`Tag is not exists`);
            }
            const addRC = await this.prisma.tag.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    taskId: dto.taskId
                }
            })
            return addRC;
        }
        async edit(tagId: number, dto: CreateTagInput){
            const getTag = await this.prisma.tag.findFirst({
                where: {
                    id: tagId
                }
            });
            if(!getTag){
                throw new BadRequestException(`Tag is not exists`);
            }
            const tag = await this.prisma.tag.update({
                where: {
                    id: tagId
                },
                data: {
                    ...dto
                }
            });
            return tag;
        }
        async delete(tagId: number){
            const findTag = await this.prisma.tag.findFirst({
                where: {
                    id: tagId
                }
            })
            if (!findTag) {
                throw new BadRequestException(`Tag is not exists`);
            }
            const result = await this.prisma.tag.delete({
                where: {
                    id: tagId
                }
            })
            return result;
        }
}
