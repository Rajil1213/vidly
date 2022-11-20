import config from 'config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send("Access denied. Not token provided.")
    }
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
        req.user = decoded;

        // pass to the next function in the req-resp cycle
        return next()
    }
    catch (ex: any) {
        res.status(400).send("Invalid token.");
    }
}
