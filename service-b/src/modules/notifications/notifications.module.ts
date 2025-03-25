import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [HttpModule, RedisModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService]
})

export class NotificationsModule {}
