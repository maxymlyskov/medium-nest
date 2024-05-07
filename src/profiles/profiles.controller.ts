import { User } from '@app/users/decorators/user.decorator';
import { AuthGuard } from '@app/users/guards/auth.guard';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileResponseInterface } from './types/profile-response.interface';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get(':username')
    async getProfile(@User('id') currentUserId: number, @Param('username') profileUsername: string): Promise<ProfileResponseInterface> {
        const profile = await this.profilesService.getProfile(currentUserId, profileUsername);
        return this.profilesService.buildProfileResponse(profile);

    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') currentUserId: number, @Param('username') profileUsername: string): Promise<ProfileResponseInterface> {
        const profile = await this.profilesService.followProfile(currentUserId, profileUsername);
        return this.profilesService.buildProfileResponse(profile);
    }
}
