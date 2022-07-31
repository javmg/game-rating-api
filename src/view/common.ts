/**
 *
 * UUID with format v4
 *
 * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
 */
export type Uuid = string;

export type Id = {

    id: Uuid
}