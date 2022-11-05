import express, { Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';

import { Movie as movieSchema, validateBody } from '../models/movie';
import { Genre as genreSchema } from '../models/genre';

const router: express.Router = express.Router();

// setup db: use vidly
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

// setup collection: Genre = db.genres
const Movie = mongoose.model('movies', movieSchema);
const Genre = mongoose.model('genres', genreSchema);

router.get('/', async (req: Request, res: Response) => {
    const genres = await Movie.find().populate('genre').select({title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1}).sort({title: 1});
    return res.send(genres);
})

router.get('/:id', async (req: Request, res: Response) => {
    const genre = await Movie.findOne({_id: req.params.id}).populate('genre').select({title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1});
    if (!genre) return res.status(400).send(`${req.params.id} is an invalid id`)
    return res.send(genre);
})

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const title = req.body.title
    const numberInStock = new Number(req.body.numberInStock).valueOf();
    const dailyRentalRate = new Number(req.body.dailyRentalRate).valueOf();

    const genre = await Genre.findOne({
        name: req.body.genre
    }).select({name: 1});

    if (!genre) return res.status(404).send(`${req.body.genre} does not exist`);

    const movie = new Movie({
        title,
        numberInStock,
        dailyRentalRate,
        genre
    })

    try {
        const result = await movie.save();
        res.send(result);
    }
    catch (err: any) {
        res.send(err.message);

    }
})

router.put('/:id', async (req: Request, res: Response) => {
    // if JSON body is invalid
    const { error } = validateBody(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const name = req.body.name;
    const numberInStock = req.body.numberInStock;
    const dailyRentalRate = req.body.dailyRentalRate;
    const genre = await Genre.findOne({
        name: req.body.genre
    }).select({name: 1});

    if (!genre) return res.status(404).send(`${req.body.genre} does not exist`);

    const result = await Movie.findByIdAndUpdate(req.params.id, {
        $set: { name, numberInStock, dailyRentalRate, genre }
    }, {new: true})
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)
    res.send(result);
})

router.delete('/:id', async (req: Request, res: Response) => {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    res.send(result);
})

export default router;