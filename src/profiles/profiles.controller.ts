import { User } from '@app/users/decorators/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
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
}
