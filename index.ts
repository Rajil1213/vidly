import express, {  Request, Response } from 'express';

const app: express.Application = express();

// sample list of genres, to be replaced with call to DB later...
const genres: string[] = [
    "Horror",
    "Humor",
    "Romance",
    "Thriller",
    "Suspense",
    "Erotica",
    "Fantasy"
]

app.get('/api/genres', (req: Request, res: Response) => {
    return res.send(genres);
})

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

