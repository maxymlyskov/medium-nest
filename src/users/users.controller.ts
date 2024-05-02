import { ExpressRequestInterface } from '@app/types/express-request.interface';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseInteface } from './types/user-response.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.createUser(createUserDto);
        return this.usersService.buildUserResponse(user);
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.login(loginUserDto);
        return this.usersService.buildUserResponse(user);
    }

    @Get('user')
    async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInteface> {
        const user = request.user;
        return this.usersService.buildUserResponse(user);
    }
}
