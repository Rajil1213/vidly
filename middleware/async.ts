import { Request, Response, NextFunction } from 'express';

export const asyncMiddleware = (handler: (req: Request, res: Response) => (Promise<any>)) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        }
        catch (ex: any) {
            next(ex)
        }
    }
}