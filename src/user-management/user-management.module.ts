import { Module } from '@nestjs/common';
import { UserManagementResolver } from './user-management.resolver';
import { UserManagementService } from './user-management.service';
import { PrismaModule } from './../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [UserManagementResolver, UserManagementService],
  exports: [UserManagementService]
})
export class UserManagementModule {}
