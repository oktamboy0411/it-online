import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserAuthMiddleware } from './middlewares/user-auth.middleware';
import { UserRoleMiddleware } from './middlewares/user-role.middleware';
import { User } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthMiddleware, UserRoleMiddleware],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserAuthMiddleware, UserRoleMiddleware)
      .exclude({ path: 'users/login', method: RequestMethod.POST })
      .forRoutes(UserController);
  }
}
