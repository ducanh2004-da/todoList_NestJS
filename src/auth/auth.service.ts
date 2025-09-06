import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserInput } from '../models/loginUser.dto';
import { CreateUserInput } from 'src/models/createUser.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginInput } from './../models/googleLogin.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,
    ) {

    }
    async signIn(data: LoginUserInput) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        });
        if (user == null) {
            throw new BadRequestException(`User is not exists`);
        }
        if (!user.password) {
            throw new BadRequestException(`User password is not set`);
        }
        const checkPwt = await argon.verify(user.password, data.password);
        if (!checkPwt) {
            throw new BadRequestException(`Password is incorrect`);
        }
        const token = await this.signToken(user.id, user.email);
        return {
            success: true,
            message: 'User logged in successfully',
            token: token.access_token
        }
    }
    async signUp(data: CreateUserInput) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        });
        if (user) {
            throw new BadRequestException(`User is already exists`);
        }
        const hash = await argon.hash(data.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hash,
                firstName: data.firstName,
                lastName: data.lastName
            }
        });
        const token = await this.signToken(newUser.id, newUser.email);
        return {
            success: true,
            message: 'User created successfully',
            token: token.access_token
        }
    }
    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload);
        return {
            access_token: token
        }
    }
    async googleLogin(data: GoogleLoginInput) {
        if (!data.googleId || !data.email) {
            throw new BadRequestException('Google ID and email are required');
        }
        let user = await this.prisma.user.findFirst({
            where: {email: data.email}
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    googleId: data.googleId,
                }
            }); 
        }
        else if (user && !user.googleId) {
             user = await this.prisma.user.update({
                where: {email: data.email},
                data: {googleId: data.googleId}
             })
        }
        const token = await this.signToken(user.id, user.email);
        return {
            success: true,
            message: 'User logged in successfully',
            token: token.access_token
        }
    }
}
