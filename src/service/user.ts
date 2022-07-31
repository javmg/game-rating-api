import {inject, provideSingleton} from "../config/ioc";
import {UserResponse, UserSearch} from "../view/user";
import {Repository, Sequelize} from "sequelize-typescript";
import UserModel from "../model/user";
import {IUserMapper, UserMapper} from "../mapper/user";
import {Op} from "sequelize";

interface IUserService {

    search(criteria: UserSearch): Promise<Array<UserResponse>>
}

@provideSingleton(UserService)
class UserService implements IUserService {

    private userRepository: Repository<UserModel>;

    constructor(@inject(Sequelize) private sequelizeConnection: Sequelize,
                @inject(UserMapper) private userMapper: IUserMapper) {
        this.userRepository = this.sequelizeConnection.getRepository(UserModel);
    }

    async search(criteria: UserSearch): Promise<Array<UserResponse>> {

        const clauseWhere = {} as any;

        if (criteria.username !== undefined) {
            clauseWhere.username = {
                [Op.iLike]: `%${criteria.username}%`
            };
        }

        const users = await this.userRepository.findAll({
            attributes: ["id", "username", "type"],
            where: clauseWhere
        })

        return this.userMapper.mapMany(users);
    }
}

export {UserService, IUserService};