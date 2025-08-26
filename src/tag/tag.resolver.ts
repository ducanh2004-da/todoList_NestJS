import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TagResponse } from '../models/tagResponse.dto';
import { TagService } from './tag.service';
import { CreateTagInput } from 'src/models';

@Resolver(() => TagResponse)
export class TagResolver {
    constructor(private tagService: TagService){}
    
        @Query(() => [TagResponse], {name: 'tags'})
        async findAllTag(){
            const result = this.tagService.findAll();
            return result;
        }
    
        @Mutation(() => TagResponse)
        async addTag(@Args('data') data:CreateTagInput){
            return this.tagService.add(data);
        }
        @Mutation(() => TagResponse)
        async editTag(@Args('id', { type: () => Number }) id: number, @Args('data') data: CreateTagInput) {
            return this.tagService.edit(id, data);
        }
    
        @Mutation(() => TagResponse)
        async deleteTag(@Args('id', { type: () => Number }) id: number) {
            return this.tagService.delete(id);
        }
}
