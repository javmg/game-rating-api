import {logger} from "./log";
import {Dialect} from "sequelize";
import {SequelizeOptions} from "sequelize-typescript/dist/sequelize/sequelize/sequelize-options";
import {findProperty, getProperty} from "../util/property";
import {Sequelize} from "sequelize-typescript";

const database: string = getProperty("db.database");
const dialect: string = getProperty("db.dialect");

const username: string = getProperty("db.username");
const password: string = getProperty("db.password");

const host: string = findProperty("db.host");
const port: number = findProperty("db.port");
const storage: string = findProperty("db.storage");

const logSql: boolean = findProperty("log.sql");

const options: SequelizeOptions = {
    database: database,
    dialect: dialect as Dialect,
    models: [__dirname + "/../model/*"],
    username: username,
    password: password,
    logging: msg => {
        if (logSql) {
            logger.debug(msg);
        }
    }
}

if (host) {
    options.host = host;
}

if (port) {
    options.port = port;
}

if (storage) {
    options.storage = storage;
}

const sequelizeConnection = new Sequelize(options);

sequelizeConnection.authenticate()

    .then(() => {
        logger.info("Database authenticate succeeded.");
    })

    .catch(err => {
        logger.error(`Database authenticate failed. Host: ${host}, port: ${port}, database: ${database}, error: ${err}`);
    });

export {sequelizeConnection};
