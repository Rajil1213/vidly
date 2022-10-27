import express, {  Request, Response } from 'express';
import Joi from 'joi';

const app: express.Application = express();

// get POST body (middleware); req.body = undefined without this
app.use(express.json());

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

app.get('/api/genres', (req: Request, res: Response) => {
    return res.send(genres);
})

app.post('/api/genres', (req: Request, res: Response) => {
    const { error } = validateBody(req.body);
    console.log(error);

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

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

