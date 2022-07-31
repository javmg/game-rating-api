import bodyParser from "body-parser";
import express from "express";
import "dotenv/config";
import {RegisterRoutes} from "../gen/route/routes";
import * as swaggerUi from "swagger-ui-express";
import {ErrorRequestHandler} from "express/ts4.0";
import {logger, morganMiddleware} from "./config/log";
import {BusinessException} from "./exception/businessException";
import {ValidateError} from "@tsoa/runtime";
import {getCode, getMessage, getStatus} from "./util/error";
import {getProperty} from "./util/property";

logger.info(`Application env: ${process.env["NODE_ENV"]}`)

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morganMiddleware);

RegisterRoutes(app);

try {
    const swaggerDocument = require("../gen/doc/swagger.json");
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
    logger.error(`Unable to load swagger.json: ${err.stack}`);
}

app.use(((err, req, res, next) => {

    if (err instanceof BusinessException) {
        logger.debug(`Business exception. Message: ${err.message}`);
    } else if (err instanceof ValidateError) {
        logger.debug(`Validation exception. Message ${err.message}`);
    } else if (err instanceof SyntaxError) {
        logger.debug(`Syntax exception. Message ${err.message}`);
    } else {
        logger.error(`Internal error. Message: ${err.message}, stack ${err.stack}`);
    }

    const status = getStatus(err);
    const code = getCode(err);
    const message = getMessage(err);

    return res.status(status).json({
        code: code,
        message: message,
    });

}) as ErrorRequestHandler);

app.use((req, res) => {
    logger.error(`Not Found: ${req.url}`);

    return res.status(404).json({
        code: "NOT_FOUND",
        message: "Not found.",
    });
});

const port: number = getProperty("server.port")

const server = app.listen(port, () =>
    logger.info(`Server running under port ${port}.`)
);

export default server;