import { UserEntity } from "@app/users/users.entity";
import { Request } from "express";

export interface ExpressRequestInterface extends Request {
    user?: UserEntity
}