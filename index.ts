import express from 'express';
import 'express-async-errors';
import { logger } from './util/logger';

const app: express.Application = express();

// setup startup error logging
import logging from './startup/logging';
logging();

// setup configuration
import configure from './startup/config';
configure();

// setup routes
import routes from './startup/routes';
routes(app);

// setup database
import database from './startup/database';
database();

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`)
})

