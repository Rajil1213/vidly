import config from 'config';
import { logger } from '../util/logger';
import 'express-async-errors';

const logging = () => {
    if (!config.get('jwtPrivateKey')) {
        logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
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
}

export default logging;