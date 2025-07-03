import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() body: { username: string; password: string; role: string }, @Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create users');
    }
    return this.usersService.create(body);
  }
} 