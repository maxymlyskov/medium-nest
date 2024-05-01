import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto);

        return await this.usersRepository.save(newUser);
    }
}
