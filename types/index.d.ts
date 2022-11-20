import User from './custom';

// to make the file a module and avoid TS error
export {}

// define a new interface for request in Express namespace
// that can take a `user` param
declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}