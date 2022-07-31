import {TournamentResponse} from "./tournament";
import {UserResponse} from "./user";
import {Id, Uuid} from "./common";

export type MatchSearch = {

    /**
     * date
     *
     * @type {string}
     * @isDate
     */

    date?: Date;

    /**
     * user id
     */

    userId?: Uuid

    /**
     * tournament id
     */

    tournamentId?: Uuid

}

export type MatchCreate = {

    /**
     * date
     *
     * @type {string}
     * @isDate
     */

    date: Date;

    /**
     * user 1
     */

    user1: Id

    /**
     * user 2
     */

    user2: Id

    /**
     * tournament
     */

    tournament: Id

}

export type MatchUpdate = {

    /**
     * start at
     *
     * @type {string}
     * @isDateTime
     */

    startAt: Date;

    /**
     * end at
     *
     * @type {string}
     * @isDateTime
     */

    endAt: Date;

    /**
     * result
     * @type {string}
     */

    result: "USER1_WINS" | "USER2_WINS" | "TIE"

}

export type MatchResponse = {

    /**
     * id
     *
     * @type {string}
     */

    id: string;

    /**
     * date
     *
     * @type {string}
     * @isDate
     */

    date: Date;

    /**
     * start at
     *
     * @type {string}
     * @isDateTime
     */

    startAt?: Date;

    /**
     * end at
     *
     * @type {string}
     * @isDateTime
     */

    endAt?: Date;

    /**
     * result
     * @type {string}
     */

    result?: "USER1_WINS" | "USER2_WINS" | "TIE"

    /**
     * tournament
     *
     */

    tournament: TournamentResponse;

    /**
     * user 1
     *
     */

    user1: UserResponse;

    /**
     * user 2
     *
     */

    user2: UserResponse;

}