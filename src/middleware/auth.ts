import * as express from "express";
import {decodeToken} from "../util/token";
import {tokenInvalid, tokenScopeInvalid} from "../error/token";

export function expressAuthentication(
    req: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "bearerToken") {

        try {

            const bearerToken = req.headers["authorization"] as string;

            const token = bearerToken.replace("Bearer ", "");

            const tokenPayload = decodeToken(token);

            if (scopes && scopes.length > 0 && !scopes.includes(tokenPayload.type)) {
                return Promise.reject(tokenScopeInvalid());
            }

            return Promise.resolve(tokenPayload);

        } catch (exception) {

            return Promise.reject(tokenInvalid());
        }
    }
}