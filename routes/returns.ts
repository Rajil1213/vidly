import express, { NextFunction, Request, Response } from 'express';

import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import { validateObjectId } from '../middleware/validateObjectId';
import { Rental } from '../models/rental';

const router: express.Router = express.Router();

///// TODO: sample list of genres, to be replaced with call to DB later...

router.post('/', async (req: Request, res: Response) => {
    return res.status(401).send('Unauthorized access')
})


export default router;