import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    sendNotification(@Body() body: { userId: string; message: string }) {
        return this.notificationService.send(body.userId, body.message);
    }

    @Get()
    getLogs() {
        return this.notificationService.getAll();
    }
}
