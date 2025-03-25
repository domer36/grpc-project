import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userData: User): User {
    const user = this.usersService.create(userData);
    return user;
  }

  @Get(':id')
  getUser(@Param('id') id: string): User | null {
    return this.usersService.findById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: User): User {
    return this.usersService.updateUser(id, body);
  }

}
