import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources: {
                db:{
                    url: 'postgresql://postgres:doducanh@localhost:5432/todoList2?schema=public'
                }
            }
        })
    }
    cleanDb(){
        return this.$transaction([
            this.task.deleteMany(),
            this.tag.deleteMany()
        ])
    }
}
