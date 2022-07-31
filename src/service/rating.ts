import {inject, provideSingleton} from "../config/ioc";
import {RatingResponse} from "../view/rating";
import {Repository, Sequelize} from "sequelize-typescript";
import RatingCurrentModel from "../model/ratingCurrent";
import RatingHistoricalModel from "../model/ratingHistorical";
import {IRatingMapper, RatingMapper} from "../mapper/rating";
import {ratingCurrentFound} from "../error/rating";

interface IRatingService {

    getCurrent(userId: string): Promise<RatingResponse>

    getHistorical(userId: string): Promise<Array<RatingResponse>>
}

@provideSingleton(RatingService)
class RatingService implements IRatingService {

    private ratingCurrentRepository: Repository<RatingCurrentModel>;
    private ratingHistoricalRepository: Repository<RatingHistoricalModel>;

    constructor(@inject(Sequelize) private sequelizeConnection: Sequelize,
                @inject(RatingMapper) private ratingMapper: IRatingMapper) {
        this.ratingCurrentRepository = this.sequelizeConnection.getRepository(RatingCurrentModel);
        this.ratingHistoricalRepository = this.sequelizeConnection.getRepository(RatingHistoricalModel);
    }

    async getCurrent(userId: string): Promise<RatingResponse> {

        const rating = await this.ratingCurrentRepository.findOne({
            where: {userId: userId},
            include: [{association: "tournament"}]
        })

        if (!rating) {
            throw ratingCurrentFound(userId);
        }

        return this.ratingMapper.map(rating);
    }

    async getHistorical(userId: string): Promise<Array<RatingResponse>> {

        const ratings = await this.ratingHistoricalRepository.findAll({
            where: {userId: userId},
            include: [{association: "tournament"}]
        })

        return this.ratingMapper.mapMany(ratings);
    }
}

export {RatingService, IRatingService};