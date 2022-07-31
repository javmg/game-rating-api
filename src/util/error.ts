import {BusinessException} from "../exception/businessException";
import {ValidateError} from "@tsoa/runtime";

const getStatus = (error: Error): number => {

    if (error instanceof BusinessException) {
        return error.status;
    } else if (error instanceof ValidateError || error instanceof SyntaxError) {
        return 400;
    }

    return 500;
}

const getCode = (error: Error): string => {

    if (error instanceof BusinessException) {
        return error.code;
    } else if (error instanceof ValidateError || error instanceof SyntaxError) {
        return "BAD_REQUEST";
    }

    return "INTERNAL_ERROR";
}

const getMessage = (error: Error): string => {

    if (error instanceof ValidateError) {

        const messageParts = [];

        for (const propName in error.fields) {
            messageParts.push(`${propName}: ${error.fields[propName].message}`)
        }

        return messageParts.join(", ");

    } else if (error.name.includes("Sequelize")) {
        return "Error in the database."
    }

    return error.message;
}

export {getStatus, getCode, getMessage}