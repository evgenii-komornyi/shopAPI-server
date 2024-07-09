import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class JWTVerification {
    verifyJWT(req: Request, res: Response, next: NextFunction): any {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.body.userId = decoded.userId;

            next();
        });
    }
}
