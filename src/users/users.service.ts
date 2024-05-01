import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    async createUser(): Promise<any> {
        return 'Create User';
    }
}
