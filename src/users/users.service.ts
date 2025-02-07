import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseInteface } from './types/user-response.interface';
import { UserEntity } from './users.entity';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }


    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {

        const errorResponse = {
            errors: {
            },
        };

        const userByEmail = await this.usersRepository.findOne({
            where: {
                email: createUserDto.email
            }
        });
        const userByUsername = await this.usersRepository.findOne({
            where: {
                username: createUserDto.username
            }
        });

        if (userByEmail) {
            errorResponse.errors['email'] = 'has already been taken';
        }
        if (userByUsername) {
            errorResponse.errors['email'] = 'has already been taken';
        }

        if (userByEmail || userByUsername) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto);

        return await this.usersRepository.save(newUser);
    }

    async login(loginUserDto: { email: string, password: string }): Promise<UserEntity> {

        const errorResponse = {
            errors: {
                'email or password': 'is invalid',
            },
        };

        const user = await this.usersRepository.findOne({
            where: {
                email: loginUserDto.email,
            },
            select: ['id', 'username', 'bio', 'image', 'email', 'password']
        });


        if (!user) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isPasswordCorrect = await compare(loginUserDto.password, user.password);


        if (!isPasswordCorrect) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        delete user.password

        return user;
    }

    buildUserResponse(user: UserEntity): UserResponseInteface {
        return {
            user: {
                ...user,
                token: this.generateJwtToken(user)
            }
        }
    }

    async findById(id: number): Promise<UserEntity> {
        return await this.usersRepository.findOne({ where: { id } });
    }

    generateJwtToken(user: UserEntity) {
        return jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, process.env.SECRET_KEY, { expiresIn: '7d' })
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        await this.usersRepository.update({ id }, updateUserDto);
        return this.findById(id);
    }
}