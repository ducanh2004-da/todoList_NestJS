import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Thêm driver vào đây
      autoSchemaFile: 'schema.gql',
      debug: true, // Bật debug mode
      introspection: true,
      playground: false,
      csrfPrevention: false, // Tắt CSRF protection
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    TaskModule,
    TagModule,
    ReportModule,
    PrismaModule, AuthModule,
    UserManagementModule
  ]
})
export class AppModule { }
