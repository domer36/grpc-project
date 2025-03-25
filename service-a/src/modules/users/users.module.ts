import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GrpcClientModule } from '../grpc/grpc.module';
import { RabbitMQClientModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [GrpcClientModule, RabbitMQClientModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
