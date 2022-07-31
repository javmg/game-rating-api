import {Uuid} from "../view/common";
import {BusinessException, IException} from "../exception/businessException";

export const userNotFound = (id: Uuid): IException => {

    return new BusinessException(
        "USER_NOT_FOUND",
        404,
        `User with id '${id}' not found.`
    )
}

export const userTypeMismatch = (id: Uuid, expectedType: string, actualType: string,): IException => {

    return new BusinessException(
        "USER_TYPE_MISMATCH",
        404,
        `User with id '${id}' has wrong type (expected: ${expectedType}, actual: ${actualType}).`
    )
}