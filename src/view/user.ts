import {Uuid} from "./common";

export type UserSearch = {

    /**
     * username
     *
     * @type {string}
     */

    username?: string;
}

export type UserResponse = {

    /**
     * id
     *
     * @type {string}
     */

    id: Uuid;

    /**
     * username
     *
     * @type {string}
     */

    username: string;

    /**
     * type
     *
     * @type {string}
     */

    type: "admin" | "player";

}