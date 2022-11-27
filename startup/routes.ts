import express, { Application } from "express";
import { errorHandler } from "../middleware/error";
import { default as genres } from '../routes/genres';
import { default as customers } from '../routes/customers';
import { default as movies } from '../routes/movies';
import { default as rentals } from '../routes/rentals';
import { default as register } from '../routes/users';
import { default as auth } from '../routes/auth';
import { default as returns } from '../routes/returns';

// for all routes starting with `/api/genres` use `genres` (router) as the handler
const routes = (app: Application) => {
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
    app.use('/api/returns', returns)

    // add error middleware
    app.use(errorHandler);
}

export default routes;