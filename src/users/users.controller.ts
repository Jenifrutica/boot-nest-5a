import { Controller, Get, Param } from '@nestjs/common';


interface User {
    id: string;
    name: string;
    email: string;
}

@Controller('users')
export class UsersController {

    private users: User[] = [
        {
            id: '1',
            name: 'Jeni',
            email: 'jeni@gmail.com'
        },
        {
            id: '2',
            name: 'Carlos',
            email: 'carlos@gmail.com'
        },
        {
            id: '3',
            name: 'Nicolás',
            email: 'nicolas@gmail.com'
        },
        {
            id: '4',
            name: 'Juan',
            email: 'juan@gmail.com'
        },
        {
            id: '5',
            name: 'Camilo',
            email: 'camilo@gmail.com'
        },
        {
            id: '6',
            name: 'David',
            email: 'david@gmail.com'
        },
        {
            id: '7',
            name: 'Ernesto',
            email: 'ernesto.gomez@gmail.com'
        },
        {
            id: '8',
            name: 'Drako',
            email: 'drako@gmail.com'
        },
        {
            id: '9',
            name: 'Yedith',
            email: 'yedith@gmail.com'
        },
        {
            id: '10',
            name: 'Victoria',
            email: 'victoria@gmail.com'
        }
    ];

    @Get('')
    getUsers() {
        return this.users;
    }



    @Get(':id')
    getUserById(@Param('id') id: string) {
        const user = this.users.find((user) => user.id === id);
        
        if (!user) {
            return 'User not found';
        }
        
        return user;
    }

    @Get('name/:name')
    getUserEmailByName(@Param('name') name: string) {
        const user = this.users.find((user) => user.name.toLowerCase() === name.toLowerCase());
        
        if (!user) {
            return 'User not found';
        }
        
        return user.email;
    }

}
