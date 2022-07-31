import {TokenResponse} from "../view/token";
import {encodePayload} from "../util/token";
import {provideSingleton} from "../config/ioc";
import UserModel from "../model/user";

interface ITokenMapper {
    map(entity: UserModel): TokenResponse;
}

@provideSingleton(TokenMapper)
class TokenMapper implements ITokenMapper {

    map = (entity: UserModel): TokenResponse => {

        const token = encodePayload({
            id: entity.id,
            username: entity.username,
            type: entity.type
        });

        return {
            token
        };
    }
}

export {ITokenMapper, TokenMapper};