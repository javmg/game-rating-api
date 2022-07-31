const config = require("config");

const getProperty = <Type extends string | number | boolean>(propertyName: string): Type => {

    const value = findProperty(propertyName);

    if (value === undefined) {
        throw new Error(`Property with name "${propertyName}" not found.`);
    }

    return value as Type;
}

const findProperty = <Type extends string | number | boolean>(propertyName: string): Type | undefined => {

    if (!config.has(propertyName)) {
        return undefined;
    }

    const valueInConfig = config.get(propertyName);

    if (typeof valueInConfig === "string" && valueInConfig.indexOf("$") === 0) {
        return process.env[valueInConfig.slice(1)] as Type
    }

    return valueInConfig as Type;
};

export {getProperty, findProperty}