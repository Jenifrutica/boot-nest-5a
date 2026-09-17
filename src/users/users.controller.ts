import { Controller, Get, Param, Post, Body, Delete, Put, Headers, NotFoundException, ForbiddenException, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';

interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: '1', name: 'Jeni', email: 'jeni@gmail.com' },
    { id: '2', name: 'Carlos', email: 'carlos@gmail.com' },
    { id: '3', name: 'Nicolás', email: 'nicolas@gmail.com' },
    { id: '4', name: 'Juan', email: 'juan@gmail.com' },
    { id: '5', name: 'Camilo', email: 'camilo@gmail.com' },
    { id: '6', name: 'David', email: 'david@gmail.com' },
    { id: '7', name: 'Ernesto', email: 'ernesto.gomez@gmail.com' },
    { id: '8', name: 'Drako', email: 'drako@gmail.com' },
    { id: '9', name: 'Yedith', email: 'yedith@gmail.com' },
    { id: '10', name: 'Victoria', email: 'victoria@gmail.com' },
  ];

  @Get('')
  getUsers() {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('name/:name')
  getUserEmailByName(@Param('name') name: string) {
    const user = this.users.find((u) => u.name.toLowerCase() === name.toLowerCase());
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.email;
  }

  @Post()
  createUser(@Body() user: User) {
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new UnprocessableEntityException('Invalid email format');
    }

    const newUser = {
      ...user,
      id: `${new Date().getTime()}`,
    }

    this.users.push(newUser);

    const exists = this.users.find((u) => u.id === user.id || u.email === user.email);
    if (exists) {
      throw new ForbiddenException('The user is already registered');
    }

    return {
      msg: 'User created successfully',
      data: newUser,
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
    return {
      msg: 'User deleted successfully',
    };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userChanges: User) {
    if (userChanges.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userChanges.email)) {
      throw new UnprocessableEntityException('Invalid email format');
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users[index] = { ...this.users[index], ...userChanges };
    return {
      msg: 'User updated successfully',
      data: this.users[index],
    };
  }

  @Post(':id/avatar')
  uploadAvatar(@Param('id') id: string, @Headers('content-type') contentType: string, @Body() body: any) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!contentType || !allowedTypes.includes(contentType)) {
      throw new UnsupportedMediaTypeException('Unsupported media type. Only PNG, JPEG, or WEBP are allowed for avatar');
    }

    return {
      msg: `Avatar uploaded successfully for user ${user.name}`,
      data: body,
    };
  }
}
