import { UserEntity } from '@app/users/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followsRepository: Repository<FollowEntity>) { }

    async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
        const errorResponse = {
            errors: {
                'username': 'not found',
            },

        }
        const user = await this.usersRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
        }

        const follow = await this.followsRepository.findOne({
            where: {
                followerId: currentUserId,
                followingId: user.id,
            }
        });

        return { ...user, following: !!follow };
    }

    async followProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
        const errorResponse = {
            errors: {
                'username': 'not found',
            },
        }
        const user = await this.usersRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
        }
        if (currentUserId === user.id) {
            throw new HttpException('Follower and following can not be the same user.', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followsRepository.findOne({
            where: {
                followerId: currentUserId,
                followingId: user.id,
            }
        });

        if (!follow) {
            const followToCreate = new FollowEntity();
            followToCreate.followerId = currentUserId;
            followToCreate.followingId = user.id;

            await this.followsRepository.save(followToCreate);
        }

        return { ...user, following: true };
    }
    async unfollowProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
        const errorResponse = {
            errors: {
                'username': 'not found',
            },

        }
        const user = await this.usersRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
        }
        if (currentUserId === user.id) {
            throw new HttpException('Follower and following can not be the same user.', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followsRepository.findOne({
            where: {
                followerId: currentUserId,
                followingId: user.id,
            }
        });

        await this.followsRepository.delete({
            followerId: currentUserId,
            followingId: user.id,
        });


        return { ...user, following: false };
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        delete profile.email;
        return {
            profile
        }

    }
}
