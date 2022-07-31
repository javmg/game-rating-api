import {Uuid} from "../view/common";
import {BusinessException, IException} from "../exception/businessException";

export const ratingCurrentFound = (userId: Uuid): IException => {

    throw new BusinessException(
        "RATING_CURRENT_NOT_FOUND",
        404,
        `Current rating for user with id '${userId}' not found.`
    )
}