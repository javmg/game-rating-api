export type TokenCreate = {

    /**
     * username
     * @type {string}
     * @minLength 3
     * @maxLength 255
     *
     */

    username: string

    /**
     * password
     * @type {string}
     * @minLength 6
     * @maxLength 255
     *
     */
    password: string
}

export type TokenResponse = {

    /**
     * token
     * @type {string}
     */

    token: string
}