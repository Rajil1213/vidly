import { NextFunction, Request, Response } from "express";

// this is applied after `auth`
export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.isAdmin) {
        return res.status(403).send("Access Denied");
    }

    next();
}