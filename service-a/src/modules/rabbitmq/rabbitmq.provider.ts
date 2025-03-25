import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const rabbitmqClientOptions: ClientProviderOptions = {
  name: 'RABBITMQ_SERVICE',
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://rabbitmq:5672'],
    queue: 'user-updates',
    queueOptions: {
      durable: false,
    },
  },
};
