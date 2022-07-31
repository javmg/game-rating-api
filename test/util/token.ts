import {encodePayload} from "../../src/util/token";
import {Uuid} from "../../src/view/common";

export const createToken = (id: Uuid, username: string, type: 'admin' | 'player') => {

    const payload = {
        'id': id,
        'username': username,
        'type': type,
    }

    return encodePayload(payload);
}