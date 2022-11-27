import express, { NextFunction, Request, Response } from 'express';

import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import { validateObjectId } from '../middleware/validateObjectId';
import { Rental, validateBody } from '../models/rental';

const router: express.Router = express.Router();

///// TODO: sample list of genres, to be replaced with call to DB later...

router.post('/', [auth], async (req: Request, res: Response) => {
    const { error } = validateBody(req.body)
    if (error) return res.status(400).send(error.details[0].message)
})


export default router;