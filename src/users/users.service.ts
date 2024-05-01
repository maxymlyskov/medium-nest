import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInteface } from './types/user-response.interface';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto);

        return await this.usersRepository.save(newUser);
    }

    buildUserResponse(user: UserEntity): UserResponseInteface {
        return {
            user: {
                ...user,
                token: this.generateJwtToken(user)
            }
        }
    }

    generateJwtToken(user: UserEntity) {
        return jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, process.env.SECRET_KEY, { expiresIn: '7d' })
    }
}
