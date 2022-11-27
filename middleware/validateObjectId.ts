import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    // // TODO: log `err`
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("Invalid ID")
    }

    next();
}