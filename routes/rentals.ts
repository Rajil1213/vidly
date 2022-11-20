import express, { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';

import { Rental, validateBody } from '../models/rental';
import { Customer } from '../models/customer';
import { Movie } from '../models/movie';
import { auth } from '../middleware/auth';

const router: express.Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const rentals = await Rental.find().sort({dateOut: -1});
    return res.send(rentals);
})

router.post('/', auth, async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    const customer = await Customer
    .findById(customerId)
    .select({name: 1, isGold: 1, phone: 1});

    if (!customer) return res.status(404).send(`${req.body.customerId} does not exist`);

    const movie = await Movie
    .findById(movieId)
    .select({title: 1, dailyRentalRate: 1, numberInStock: 1});

    if (!movie) return res.status(404).send(`${req.body.movieId} does not exist`);

    if (movie.numberInStock == 0) return res.status(404).send('Movie not in stock')

    const rental = new Rental({
        customer,
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        // mongoose sets the remaining properties automatically
    })

    let session: ClientSession | undefined;
    try {
        // the next two operations must be atomic
        // see: two-face commit or simulate a transaction
        
        // normal operation
        // const result = await rental.save();
        // movie.numberInStock--;
        // movie.save()

        // using mongoose transactions

        // start a session 
        session = await mongoose.startSession();
        await session.withTransaction(async () => {
            // task 1
            const result = await rental.save();
            // trigger an exception to test atomicity,
            // this only works with mongodb in replicaSet (with multiple instances)
            if (Math.random() > 0.5) {
                throw new Error('something bad happened');
            }
            // task 2
            movie.numberInStock--;
            movie.save();
            res.send(result);
        })
    }
    catch (err: any) {
        res.send(err.message);
    }
    finally {
        // end the session if one exists
        if (session !== undefined) {
            session.endSession();
        }
    }
})

export default router;