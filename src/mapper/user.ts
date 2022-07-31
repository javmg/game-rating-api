import {UserResponse} from "../view/user";
import {provideSingleton} from "../config/ioc";
import UserModel from "../model/user";

interface IUserMapper {

    map(entity: UserModel): UserResponse;

    mapMany(entity: Array<UserModel>): Array<UserResponse>;
}

@provideSingleton(UserMapper)
class UserMapper implements IUserMapper {

    map = (entity: UserModel): UserResponse => {

        return {
            id: entity.id,
            username: entity.username,
            type: entity.type
        };
    }

    mapMany = (entities: Array<UserModel>): Array<UserResponse> => {
        return entities.map(this.map);
    }
}

export {UserMapper, IUserMapper};