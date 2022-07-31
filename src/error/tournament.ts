import {Uuid} from "../view/common";
import {BusinessException, IException} from "../exception/businessException";

export const tournamentNotFound = (id: Uuid): IException => {

    return new BusinessException(
        "TOURNAMENT_NOT_FOUND",
        404,
        `Tournament with id '${id}' not found.`
    )
}

export const tournamentAlreadyProcessed = (id: Uuid): IException => {

    throw new BusinessException(
        "TOURNAMENT_ALREADY_PROCESSED",
        409,
        `Tournament with id '${id}' already processed.`
    )
}

export const tournamentNotEnded = (id: Uuid): IException => {

    throw new BusinessException(
        "TOURNAMENT_NOT_ENDED",
        409,
        `Tournament with id '${id}' not ended.`
    )
}

export const tournamentNotOngoing = (id: Uuid): IException => {

    throw new BusinessException(
        "TOURNAMENT_NOT_ONGOING",
        409,
        `Tournament with id '${id}' not ongoing.`
    )
}