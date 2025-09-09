import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserInput } from '../models/loginUser.dto';
import { CreateUserInput } from 'src/models/createUser.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginInput } from './../models/googleLogin.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,
    ) {
        const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
        this.googleClient = new OAuth2Client(clientId);
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
            token: token.access_token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
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
            token: token.access_token,
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
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
    async verifyGoogleToken(idToken: string){
        const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
        if(!clientId){
            throw new Error('Google Client ID is not set');
        }
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: clientId
        });
        const payload = ticket.getPayload();
        if(!payload){
            throw new UnauthorizedException('Invalid Google token');
        }
        return {
            googleId: payload['sub'],
            email: payload['email']
        };
    }
    async googleLogin(idToken: string) {
        if (!idToken) {
            throw new BadRequestException('idToken is required');
        }
        const data = await this.verifyGoogleToken(idToken);
        let user = await this.prisma.user.findFirst({
            where: {email: data.email}
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: data.email ?? '',
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
            token: token.access_token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }
    }
    async logout(context){
        if(!context || !context.res || typeof context.res.clearCookie !== 'function'){
            throw new UnauthorizedException('Logout failed: Invalid request context');
        }
        context.res.clearCookie('jwt');
        return true;
    }
}
