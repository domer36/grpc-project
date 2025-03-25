import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: User): Promise<User> {
    const user = await this.usersService.create(userData);
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: User): Promise<User> {
    return await this.usersService.updateUser(id, body);
  }

}
