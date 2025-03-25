import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientProviderOptions = {
  name: 'NOTIFICATION_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'notification',
    protoPath: join(__dirname, '../../../src/modules/grpc/notification.proto'),
    url: 'service-b:50051',
  },
};
