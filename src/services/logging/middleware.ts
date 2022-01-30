import * as winston from "winston";
import * as express from "express";
import { AuthRequest } from "../auth/auth.functions";

const consoleTransport = new winston.transports.Console();

const myWinstonOptions = {
    transports: [consoleTransport]
}

export const logger = winston.createLogger(myWinstonOptions);

export function requestLoggingMiddleware(req: express.Request, res: express.Response, next: CallableFunction){
    logger.info(req.url);
    next();
}