import { UserType } from "./user.type";

export interface UserResponseInteface {
    user: UserType & { token: string }
}