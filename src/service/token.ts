import {TokenCreate, TokenResponse} from "../view/token";
import {ITokenMapper, TokenMapper} from "../mapper/token";
import {matches} from "../util/crypto";
import {inject, provideSingleton} from "../config/ioc";
import {Repository, Sequelize} from "sequelize-typescript";
import UserModel from "../model/user";
import {tokenCredentialsInvalid} from "../error/token";

interface ITokenService {
    create(request: TokenCreate): Promise<TokenResponse>
}

@provideSingleton(TokenService)
class TokenService implements ITokenService {

    private userRepository: Repository<UserModel>;

    constructor(@inject(Sequelize) private sequelizeConnection: Sequelize,
                @inject(TokenMapper) private tokenMapper: ITokenMapper) {
        this.userRepository = this.sequelizeConnection.getRepository(UserModel);
    }

    async create(criteria: TokenCreate): Promise<TokenResponse> {

        const user = await this.userRepository.findOne({
            attributes: ["id", "username", "type", "passwordHashed"],
            where: {username: criteria.username},
        });

        const invalidCredentials = !user || !await matches(
            criteria.password,
            user.passwordHashed,
        )

        if (invalidCredentials) {
            throw tokenCredentialsInvalid();
        }

        return this.tokenMapper.map(user);
    }
}

export {TokenService, ITokenService};