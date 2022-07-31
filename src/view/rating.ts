import {Uuid} from "./common";
import {TournamentResponse} from "./tournament";

export type RatingResponse = {

    /**
     * id
     *
     * @type {string}
     */

    id: Uuid;

    /**
     * rating value
     *
     * @type {number}
     */

    value: number;

    /**
     * tournament
     *
     * @type {number}
     */

    tournament: TournamentResponse;

}