import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.usersService.createUser(createUserDto);
    }
}
