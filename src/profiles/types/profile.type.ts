import { UserType } from "@app/users/types/user.type";

export type ProfileType = UserType & { following: boolean }