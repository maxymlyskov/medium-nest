import { BackendValidationPipe } from '@app/shared/pipes/backend-validation.pipe';
import { Body, Controller, Get, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponseInteface } from './types/user-response.interface';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('users')
    @UsePipes(new BackendValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.createUser(createUserDto);
        return this.usersService.buildUserResponse(user);
    }

    @Post('users/login')
    @UsePipes(new BackendValidationPipe())
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.login(loginUserDto);
        return this.usersService.buildUserResponse(user);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInteface> {
        return this.usersService.buildUserResponse(user);
    }

    @Put('user')
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInteface> {
        const user = await this.usersService.updateUser(currentUserId, updateUserDto);
        return this.usersService.buildUserResponse(user);
    }
}
