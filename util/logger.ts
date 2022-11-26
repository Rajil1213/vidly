import { createLogger, format, transports } from 'winston';

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
        new transports.File({ filename: "vidly.log", level: 'debug'})
    ]
})
