import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { GrpcClientModule } from './modules/grpc/grpc.module';

@Module({
  imports: [UsersModule, GrpcClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
