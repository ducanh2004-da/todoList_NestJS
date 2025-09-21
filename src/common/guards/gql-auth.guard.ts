// src/auth/gql-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req;
    const authHeader = req?.headers?.authorization || req?.cookies?.jwt;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    let token = '';
    if (authHeader.startsWith && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader; // maybe cookie contains token
    }

    try {
      const secret = process.env.JWT_SECRET; // or inject ConfigService
      const payload: any = await this.jwtService.verifyAsync(token, { secret });
      // payload should contain sub (userId), email, role
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      // attach user to context for later guards/resolvers
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
