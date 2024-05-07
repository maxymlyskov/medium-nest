import { UserEntity } from '@app/users/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfilesService {
    constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }

    async getProfile(currentUserId: number, profileUsername: string) {
        const user = await this.usersRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        return { ...user, following: false };
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        return {
            profile
        }

    }
}
