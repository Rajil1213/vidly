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

    const { customerId, movieId } = req.body;
    const rental = await Rental.findOne({
        "customer._id": customerId,
        "movie._id": movieId
    })

    if (!rental) return res.status(404).send("Rental not found")

    if (rental.dateReturned) return res.status(300).send("Already returned")

    rental.dateReturned = new Date(Date.now());
    rental.setRentalFee();
    await rental.save();

    return res.status(200).send("OK")
})


export default router;