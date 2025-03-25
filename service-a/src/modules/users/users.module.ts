import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GrpcClientModule } from '../grpc/grpc.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
