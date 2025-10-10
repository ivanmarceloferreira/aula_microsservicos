import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    findAll() {
       return this.usersService.findAll();
    }

    @Post()
    createUser(@Body() user: any) {
        return this.usersService.create(user.name, user.email, user.password);
    }

    @Get('/:id')
    findOne(@Body('id') id: number) {
        return this.usersService.findOne(id);
    }

}
