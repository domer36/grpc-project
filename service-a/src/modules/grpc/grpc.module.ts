import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from './grpc.provider';

@Module({
  imports: [ClientsModule.register([grpcClientOptions])],
  exports: [ClientsModule],
})
export class GrpcClientModule {}
