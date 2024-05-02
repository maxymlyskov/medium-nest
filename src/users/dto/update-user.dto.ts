import { IsEmail } from "class-validator";

export class UpdateUserDto {
    readonly username: string;

    readonly bio: string;

    readonly image: string;


    @IsEmail()
    readonly email: string;

}