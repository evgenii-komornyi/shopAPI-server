import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Status } from '../enums/Status.ts';

dotenv.config();

export class JWTVerification {
    public verifyUserJWT(req: Request, res: Response, next: NextFunction): any {
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
            req.body.roles = decoded.roles;

            next();
        });
    }

    public verifyEmailJWT(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        const token = req.query.emailToken;

        if (!token) {
            return res.status(200).json({
                data: { status: Status.FAILED, errors: ['Token is missing.'] },
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.body.userId = decoded.userId;
            req.body.email = decoded.email;

            next();
        } catch (error) {
            return res.status(200).json({
                data: {
                    status: Status.FAILED,
                    errors: ['Invalid or expired verification token.'],
                },
            });
        }
    }
}
