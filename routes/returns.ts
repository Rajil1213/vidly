import express, { NextFunction, Request, Response } from 'express';

import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import { validateObjectId } from '../middleware/validateObjectId';
import { Rental, validateBody } from '../models/rental';
import { Movie } from '../models/movie';
import { validateReq } from '../middleware/validateReq';

const router: express.Router = express.Router();

///// TODO: sample list of genres, to be replaced with call to DB later...

router.post('/', [auth, validateReq(validateBody)], async (req: Request, res: Response) => {
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

    const movie = await Movie.findById(movieId);
    if (movie) {
        movie.numberInStock++;
        movie.save()
    }

    return res.status(200).send(rental);
})


export default router;