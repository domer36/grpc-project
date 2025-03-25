import { Injectable } from '@nestjs/common';
import { User } from './users.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: User): User {
    const newUser: User = { ...user, id: uuidv4() };
    this.users.push(newUser);
    return newUser;
  }

  findById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }
}
