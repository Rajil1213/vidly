import { Application } from "express";
import helmet from "helmet";
import compression from "compression";

const prod =  (app: Application) => {
   app.use(helmet());
   app.use(compression()); 
}

export default prod;