import express, { Request, Response } from 'express';
import Joi from 'joi';
import mongoose, { mongo } from 'mongoose';

const router: express.Router = express.Router();

// setup db: use vidly
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength :3,
        required: true
    }
})

// setup collection: Genre = db.genres
const Genre = mongoose.model('genres', genreSchema);

///// TODO: sample list of genres, to be replaced with call to DB later...

const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(body);
}

router.get('/', async (req: Request, res: Response) => {
    const genres = await Genre.find().select({name: 1, _id: 0});
    return res.send(genres);
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