import mongoose from "mongoose";
import { logger } from "../util/logger";

// setup db: use vidly
// for single-replicaSet, set `directConnection=true` to
// force dispatch all operations to the host specified in the connection URI.
const database = (connectionString: string) => {
    mongoose.connect('mongodb://localhost:27017/vidly?directConnection=true')
        .then(() => logger.info("Successfully connected to MongoDB"))
}

export default database;