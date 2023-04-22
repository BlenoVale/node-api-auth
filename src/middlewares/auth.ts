import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

// Basic Auth 
export const BasicAuth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false;
        // Fazer verificação de auth
        if (req.headers.authorization) {
            let hash: string = req.headers.authorization.substring(6);
            let decoded: string = Buffer.from(hash, 'base64').toString();
            let data: string[] = decoded.split(':');

            if (data.length === 2) {
                let hasUser = await User.findOne({
                    where: {
                        email: data[0],
                        password: data[1]
                    }
                });

                if (hasUser) {
                    success = true;
                }
            }
        }

        if (success) {
            next();
        } else {
            res.status(401); // Not authorized
            res.json({ error: 'Não autorizado.' });
        }
    }
}

// JWT Auth 
export const JWTAuth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false;
        // Fazer verificação de auth
        if (req.headers.authorization) {
            //Bearer token
            const [authType, token] = req.headers.authorization.split(' ');
            if (authType === 'Bearer') {
                try {
                    const decoded = JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );

                    success = true;
                } catch (error) {

                }
            }
        }

        if (success) {
            next();
        } else {
            res.status(401); // Not authorized
            res.json({ error: 'Não autorizado.' });
            return;
        }
    }
}