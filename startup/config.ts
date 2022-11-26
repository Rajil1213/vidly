import config from 'config';
import { logger } from '../util/logger';

const configure = () => {
    if (!config.get('jwtPrivateKey')) {
        logger.error("FATAL ERROR: jwtPrivateKey is not defined.");
        process.exit(1);
    }
}

export default configure;
