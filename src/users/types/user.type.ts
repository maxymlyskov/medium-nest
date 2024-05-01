import { UserEntity } from "../users.entity";

export type UserType = Omit<UserEntity, 'hashPassword'>