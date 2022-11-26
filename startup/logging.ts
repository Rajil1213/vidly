import config from 'config';
import { logger } from '../util/logger';
import 'express-async-errors';

const logging = () => {

    process.on('uncaughtException', (ex: any) => {
        logger.error(ex.message);
        process.exit(1);
    })

    process.on('unhandledRejection', (ex: any) => {
        logger.error(ex.message);
        process.exit(1);
    })
}

export default logging;