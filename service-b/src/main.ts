import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const document = yaml.load(
      readFileSync(resolve(__dirname, '../src/docs/swagger.yaml'), 'utf8')
    );
    SwaggerModule.setup('api', app, document);

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, '../src/modules/notifications/notification.proto'),
        url: '0.0.0.0:50051',
      },
    });

    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'user-updates',
        queueOptions: {
          durable: false,
        },
      },
    });
    
    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
