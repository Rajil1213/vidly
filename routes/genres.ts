import express, { Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';

import { Genre as genreSchema, validateBody } from '../models/genre';

const router: express.Router = express.Router();

// setup db: use vidly
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

// setup collection: Genre = db.genres
const Genre = mongoose.model('genres', genreSchema);

///// TODO: sample list of genres, to be replaced with call to DB later...

router.get('/', async (req: Request, res: Response) => {
    const genres = await Genre.find().select({name: 1}).sort({name: 1});
    return res.send(genres);
})

router.get('/:id', async (req: Request, res: Response) => {
    const genre = await Genre.findOne({_id: req.params.id}).select({name: 1});
    if (!genre) return res.status(400).send(`${req.params.id} is an invalid id`)
    return res.send(genre);
})

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const name = req.body.name
    const genre = new Genre({
        name: name
    })

    try{
        const result = await genre.save();
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
    const result = await Genre.findByIdAndUpdate(req.params.id, {
        $set: { name: name}
    }, {new: true})
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)
    res.send(result);
})

router.delete('/:id', async (req: Request, res: Response) => {
    const result = await Genre.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    res.send(result);
})

export default router;