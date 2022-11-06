import express, {  Request, Response } from 'express';
import { default as genres } from './routes/genres';
import { default as customers } from './routes/customers';
import { default as movies } from './routes/movies';
import { default as rentals } from './routes/rentals';
import mongoose from 'mongoose';

const app: express.Application = express();

// get POST body (middleware); req.body = undefined without this
app.use(express.json());
// for all routes starting with `/api/genres` use `genres` (router) as the handler
app.use('/api/genres', genres);
// similarly,
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

// setup db: use vidly
// for single-replicaSet, set `directConnection=true` to
// force dispatch all operations to the host specified in the connection URI.
mongoose.connect('mongodb://localhost:27017/vidly?directConnection=true')
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

