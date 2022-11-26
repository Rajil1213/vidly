import { NextFunction, Request, Response } from "express";
import { logger } from '../util/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // // TODO: log `err`
    logger.error(err.message, err)
    return res.status(500).send("Something went wrong.")
}