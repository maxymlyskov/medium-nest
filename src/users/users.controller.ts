import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInteface } from './types/user-response.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.createUser(createUserDto);
        return this.usersService.buildUserResponse(user);
    }
}
