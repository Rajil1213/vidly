import config from 'config';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
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

