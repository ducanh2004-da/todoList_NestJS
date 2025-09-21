import { Resolver,  Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UserResponse } from 'src/models/userResponse.dto';
import { UserPagination } from 'src/models/userPagination.dto';
import { UserManagementService } from './user-management.service';
import { ReturnResult } from 'src/models/returnResult.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthContext } from 'src/common/interfaces/auth.interface';

@Resolver(() => UserResponse)
export class UserManagementResolver {
    constructor(private userService: UserManagementService){}
    @Query(() => UserPagination, {name: 'users'})
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async GetAllUser(
        @Args('currentPage', {type: () => Number}) currentPage: number,
        @Context() ctx: any
    ){
        if(!ctx.req.user){
            throw new ForbiddenException('Not authentication, Sign In plz!');
        }
        const pageSize = 5;
        return this.userService.findAll(pageSize, currentPage);
    }

    @Query(() => UserResponse, {name: 'userId'})
    @UseGuards(GqlAuthGuard, RolesGuard)
    async GetUserById(
        @Args('userId', {type: () => Number}) userId: number,
        @Context() ctx: any
    ){
        if(!ctx.req.user){
            throw new ForbiddenException('Not authentication');
        }
        return this.userService.findById(userId);
    }
    @Mutation(() => ReturnResult)
    @UseGuards(GqlAuthGuard, RolesGuard)
    async deleteUser(
        @Args('userId', {type: () => Number}) userId: number
    ){
        return this.userService.deleteUser(userId);
    }

}
