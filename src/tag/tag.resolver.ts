import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TagResponse } from '../models/tagResponse.dto';
import { TagService } from './tag.service';
import { CreateTagInput } from '../models/createTag.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => TagResponse)
export class TagResolver {
    constructor(private tagService: TagService){}
    
        @Query(() => [TagResponse], {name: 'tags'})
        @UseGuards(GqlAuthGuard)
        async findAllTag(){
            const result = this.tagService.findAll();
            return result;
        }
    
        @Mutation(() => TagResponse)
        @UseGuards(GqlAuthGuard)
        async addTag(@Args('data') data:CreateTagInput){
            return this.tagService.add(data);
        }
        @Mutation(() => TagResponse)
        @UseGuards(GqlAuthGuard)
        async editTag(@Args('id', { type: () => Number }) id: number, @Args('data') data: CreateTagInput) {
            return this.tagService.edit(id, data);
        }
    
        @Mutation(() => TagResponse)
        @UseGuards(GqlAuthGuard)
        async deleteTag(@Args('id', { type: () => Number }) id: number) {
            return this.tagService.delete(id);
        }
}
