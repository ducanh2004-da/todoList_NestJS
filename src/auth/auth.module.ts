import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from '../strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
        PrismaModule,
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
  providers: [AuthService, AuthResolver, GoogleStrategy],
})
export class AuthModule {}
