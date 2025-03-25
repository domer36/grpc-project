import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RabbitListenerController } from './modules/rabbitmq/rabbitmq-listener.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [AppController, RabbitListenerController],
  providers: [AppService],
})
export class AppModule {}
