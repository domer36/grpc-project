import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, User } from './notification.interface';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
    constructor(private readonly httpService: HttpService) {}
    private logs: Notification[] = [];

    async send(userId: string, message: string): Promise<Notification> {
    const user = <User>await this.getUserFromServiceA(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const newNotification: Notification = {
        id: uuidv4(),
        user,
        message,
        timestamp: new Date().toISOString(),
    };

    this.logs.push(newNotification);
        return newNotification;
    }

    getAll(): Notification[] {
        return this.logs;
    }

    private async getUserFromServiceA(userId: string) : Promise<User | null> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`http://service-a:3000/users/${userId}`)
          );
          return response.data;
        } catch (err) {
            return null;
        }
      }
}
