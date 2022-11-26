import config from 'config';
import express, {  Request, Response } from 'express';
import 'express-async-errors';
import { default as genres } from './routes/genres';
import { default as customers } from './routes/customers';
import { default as movies } from './routes/movies';
import { default as rentals } from './routes/rentals';
import { default as register } from './routes/users';
import { default as auth } from './routes/auth';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/error';
import { logger } from './util/logger';

const app: express.Application = express();

if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

process.on('uncaughtException', (ex: any) => {
    logger.error(ex.message);
    process.exit(1);
})

process.on('unhandledRejection', (ex: any) => {
    logger.error(ex.message);
    process.exit(1);
})

// get POST body (middleware); req.body = undefined without this
app.use(express.json());
// for all routes starting with `/api/genres` use `genres` (router) as the handler
app.use('/api/genres', genres);
// similarly,
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', register);
app.use('/api/auth', auth);

// add error middleware
app.use(errorHandler);

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

