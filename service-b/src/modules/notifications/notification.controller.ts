import { Controller, Post, Body, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
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

    @GrpcMethod('NotificationService', 'NotifyUser')
    notifyUser(data: { userId: string; message: string }): { status: string } {
        console.log('Notificación recibida por gRPC:', data);
        return { status: 'OK' };
    }
}
