import {Controller} from "tsoa";
import {Container, decorate, inject, injectable, interfaces} from "inversify";
import {makeFluentProvideDecorator} from "inversify-binding-decorators";
import {Sequelize} from "sequelize-typescript";
import {sequelizeConnection} from "./db";

decorate(injectable(), Controller);

type Identifier = string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>;

const iocContainer = new Container();

const fluentProvider = makeFluentProvideDecorator(iocContainer);

const provideSingleton = (identifier: Identifier) => fluentProvider(identifier).inSingletonScope().done();

iocContainer.bind(Sequelize).toDynamicValue(() => sequelizeConnection);

export {iocContainer, provideSingleton, inject};