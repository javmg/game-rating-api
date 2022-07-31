import {Uuid} from "./common";

export type TournamentCreate = {

    /**
     * name
     *
     * @type {string}
     * @minLength 3
     * @maxLength 255
     */

    name: string;

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

}

export type TournamentSearch = {

    /**
     * name
     *
     * @type {string}
     */

    name?: string;

    /**
     * processed
     *
     * @type {boolean}
     */

    processed?: boolean;
}

export type TournamentResponse = {

    /**
     * id
     *
     * @type {string}
     */

    id: Uuid;

    /**
     * name
     *
     * @type {string}
     */

    name: string;

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
     * processed
     *
     * @type {boolean}
     */

    processed: boolean;

}