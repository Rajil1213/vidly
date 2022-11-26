import config from 'config';
import express from 'express';
import 'express-async-errors';
import { logger } from './util/logger';

const app: express.Application = express();

// setup routes
import routes from './startup/routes'
routes(app);

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

// setup database
import database from './startup/database';
database('mongodb://localhost:27017/vidly?directConnection=true')

const PORT = Number(process.env.PORT).valueOf() || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

