import express, {  Request, Response } from 'express';
import { default as genres } from './routes/genres';

const app: express.Application = express();

// get POST body (middleware); req.body = undefined without this
app.use(express.json());
// for all routes starting with `/api/genres` use `genres` (router) as the handler
app.use('/api/genres', genres);

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

