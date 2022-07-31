import winston, {format} from "winston";
import * as Transport from "winston-transport";

import {getProperty} from "../util/property";

import morgan from "morgan";
import * as logform from "logform";
import * as http from "http";

const {combine, timestamp, printf} = winston.format;

const transports = [] as Array<Transport>;

const shouldLogInConsole: boolean = getProperty("log.console");

if (shouldLogInConsole) {
    transports.push(new winston.transports.Console({
        format: format.combine(format.uncolorize()),
    }))
}

const shouldUseTimestamp: boolean = getProperty("log.timestamp");

const formatToUse: logform.Format = shouldUseTimestamp ?
    combine(timestamp(), printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)) :
    printf(info => `${info.level}: ${info.message}`);

const logLevelToUse: string = getProperty("log.level");

const logger = winston.createLogger({
    level: logLevelToUse,
    format: formatToUse,
    defaultMeta: {service: "logger"},
    transports: transports,
});

const shouldLogHttp: boolean = getProperty("log.http");

const stream = {
    write: (message: string) => logger.http(message.substring(0, message.lastIndexOf("\n")))
};

const skip = (req: http.IncomingMessage, res: http.OutgoingMessage) => {

    if (!shouldLogHttp) {
        return true;
    }

    const isHealthEndpoint = req.url.includes("/health");

    if (!isHealthEndpoint) {
        return false;
    }

    return !req.url.includes("log");
};

const morganMiddleware = morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    {stream, skip}
);

export {logger, morganMiddleware};
