import express, { Request, Response } from 'express';

import { Genre, validateBody } from '../models/genre';
import { auth } from '../middleware/auth';

const router: express.Router = express.Router();

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

router.post('/', auth, async (req: Request, res: Response) => {
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

router.put('/:id', auth, async (req: Request, res: Response) => {
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

router.delete('/:id', auth, async (req: Request, res: Response) => {
    const result = await Genre.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    res.send(result);
})

export default router;