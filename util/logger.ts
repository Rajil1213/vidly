import { createLogger, format, transports } from 'winston';
import 'winston-mongodb'

const { combine, splat, timestamp, printf } = format;

// setup winston
const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `  
  if(metadata) {
      msg += JSON.stringify(metadata)
  }
  return msg
}); 

export const logger = createLogger({
    level: "debug",
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ filename: "vidly.log", level: 'debug'}),
        new transports.MongoDB({
            db: 'mongodb://localhost:27017/vidly?directConnection=true', // in prod, use a separate database for logs
            options: {
                useUnifiedTopology: true,
            }
        })    
    ]
})
