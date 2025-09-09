import { Resolver ,Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from 'src/models/authResponse.dto';
import { CreateUserInput } from 'src/models/createUser.dto';
import { LoginUserInput } from 'src/models/loginUser.dto';
import { BadRequestException } from '@nestjs/common';
import { GoogleLoginInput } from './../models/googleLogin.dto';

@Resolver(() => AuthResponse)
export class AuthResolver {
    constructor(private authService: AuthService){}

    @Mutation(() => AuthResponse)
    async signIn(@Args('data') data: LoginUserInput){
        return this.authService.signIn(data);
    }
    @Mutation(() => AuthResponse)
    async signUp(@Args('data') data: CreateUserInput){
        return this.authService.signUp(data);
    }
    @Mutation(() => AuthResponse)
    async googleLogin(@Args('idToken') idToken: string){
        return this.authService.googleLogin(idToken);
    }
    @Mutation(() => Boolean)
    async logout(@Context() context){
        this.authService.logout(context);
    }
}
