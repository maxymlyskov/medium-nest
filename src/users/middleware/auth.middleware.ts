import { ExpressRequestInterface } from "@app/types/express-request.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { UsersService } from "../users.service";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }
    async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            next()
            return
        }
        const token = req.headers.authorization.split(' ')[1]
        try {
            const decode = verify(token, process.env.SECRET_KEY)
            const user = await this.usersService.findById(decode.id)
            req.user = user
            next()
        } catch (error) {
            req.user = null;
            next()
        }
    }
}   