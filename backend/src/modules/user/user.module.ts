import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/store.schema';
import { UserController } from './user.controller';
import { User } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
