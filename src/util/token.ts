import {decode, encode, TAlgorithm} from "jwt-simple";
import {getProperty} from "./property";

const secret: string = getProperty("jwt.secret");
const algorithm: TAlgorithm = "HS512";

export class TokenPayload {
    id: string
    username: string
    type: string
}

export function encodePayload(payload: TokenPayload): string {
    return encode(payload, secret, algorithm);
}

export function decodeToken(token: string): TokenPayload {
    return decode(token, secret, false, algorithm);
}