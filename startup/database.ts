import config from 'config';
import mongoose from "mongoose";
import { logger } from "../util/logger";

// setup db: use vidly
// for single-replicaSet, set `directConnection=true` to
// force dispatch all operations to the host specified in the connection URI.
const database = () => {
    const db = (config.get('db') as string);
    mongoose.connect(db)
        .then(() => logger.info(`Successfully connected to ${db}...`))
}

export default database;