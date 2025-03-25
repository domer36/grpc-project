import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.interface';
import { v4 as uuidv4 } from 'uuid';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private notificationService: any
  constructor(
    @Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc,
    @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  onModuleInit() {
    this.notificationService = this.client.getService<any>('NotificationService');
  }

  create(user: User): User {
    const newUser: User = { ...user, id: uuidv4() };
    this.users.push(newUser);

    this.notificationService.notifyUser({
      userId: newUser.id,
      message: `Nuevo usuario creado: ${newUser.name}`,
    }).toPromise().catch(console.error);

    return newUser;
  }

  updateUser(id: string, data: Partial<User>): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException();

    Object.assign(user, data);
    this.rabbitClient.emit('user_updated', user);

    return user;
  }

  findById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }
}
