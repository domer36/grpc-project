import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitmqClientOptions } from './rabbitmq.provider';

@Module({
    imports: [ClientsModule.register([rabbitmqClientOptions])],
    exports: [ClientsModule],
})
export class RabbitMQClientModule {}
