import express, { Request, Response } from 'express';
import Joi from 'joi';

const router: express.Router = express.Router();

type genreType = {
    id: number; 
    name: string
};

// sample list of genres, to be replaced with call to DB later...
const genres: genreType[] = [
    {id: 1, name: "Horror"},
    {id: 2, name: "Humor"},
    {id: 3, name: "Romance"},
    {id: 4, name: "Thriller"},
    {id: 5, name: "Suspense"},
    {id: 6, name: "Erotica"},
    {id: 7, name: "Fantasy"}
]

const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(body);
}

const isValidId = (val: any): [boolean, genreType] => {
    const emptyGenre = {id: 0, name: ''};

    let id = Number(val).valueOf();
    if (!id) return [false, emptyGenre];

    let genre = genres.find((el: genreType) => el.id === id);
    if (!genre) return [false, emptyGenre];

    return [true, genre];
}

router.get('/', (req: Request, res: Response) => {
    return res.send(genres);
})

router.post('/', (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let genre: genreType = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre);

    res.send(genre);
})

router.put('/:id', (req: Request, res: Response) => {
    let [result, genre] = isValidId(req.params.id);

    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    // if JSON body is invalid
    const { error } = validateBody(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    genre.name = req.body.name;
    res.send(genre);
})

router.delete('/:id', (req: Request, res: Response) => {
    let [result, genre] = isValidId(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    let idxToRemove: number = genres.indexOf(genre);
    genres.splice(idxToRemove, 1);

    res.send(genre);
})

export default router;