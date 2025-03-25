import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Notification Service')
      .setDescription('API para la creación de usuarios')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
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
