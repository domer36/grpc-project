import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.interface';
import { v4 as uuidv4 } from 'uuid';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private notificationService: any
  constructor(
    @Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc,
    @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    this.notificationService = this.client.getService<any>('NotificationService');
  }

  async create(user: User): Promise<User> {
    const id = uuidv4()
    const newUser: User = { ...user, id };
    // this.users.push(newUser);
    await this.redisService.getClient().hmset(`user:${id}`, newUser as any);

    this.notificationService.notifyUser({
      userId: newUser.id,
      message: `Nuevo usuario creado: ${newUser.name}`,
    }).toPromise().catch(console.error);

    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException();

    Object.assign(user, data);
    await this.redisService.getClient().hmset(`user:${id}`, user as any);
    this.rabbitClient.emit('user_updated', user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.redisService.getClient().hgetall(`user:${id}`);
    if (Object.keys(data).length === 0) return null;

    return {
      id,
      name: data.name,
      email: data.email,
      age: Number(data.age),
    };
  }
}
