import { Request, Response } from "express";

export const error = (err: any, req: Request, res: Response) => {
    // TODO: log `err`
    return res.status(500).send("Something went wrong.")
}