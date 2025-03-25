import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, User } from './notification.interface';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotificationService {
    redis
    constructor(
        private readonly httpService: HttpService,
        private readonly redisService: RedisService
    ) {
        this.redis = this.redisService.getClient();
    }
    
    async send(userId: string, message: string): Promise<Notification> {
        
        const user = <User>await this.getUserFromServiceA(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const newNotification: Notification = {
            id: uuidv4(),
            user,
            message,
            timestamp: new Date().toISOString(),
        };

        // this.logs.push(newNotification);
        await this.redis.lpush('notifications', JSON.stringify(newNotification));
        return newNotification;
    }

    async getAll(): Promise<Notification[]> {
        const items = await this.redis.lrange('notifications', 0, -1);
        return items.map((item) => JSON.parse(item));
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
