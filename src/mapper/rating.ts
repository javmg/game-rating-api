import {RatingResponse} from "../view/rating";
import {inject, provideSingleton} from "../config/ioc";
import RatingAbstract from "../model/abstract/ratingAbstract";
import {ITournamentMapper, TournamentMapper} from "./tournament";

interface IRatingMapper {

    map(entity: RatingAbstract): RatingResponse;

    mapMany(entity: Array<RatingAbstract>): Array<RatingResponse>;
}

@provideSingleton(RatingMapper)
class RatingMapper implements IRatingMapper {

    constructor(@inject(TournamentMapper) private tournamentMapper: ITournamentMapper) {
    }


    map = (entity: RatingAbstract): RatingResponse => {

        return {
            id: entity.id,
            value: entity.value,
            tournament: this.tournamentMapper.map(entity.tournament)
        };
    }

    mapMany = (entities: Array<RatingAbstract>): Array<RatingResponse> => {
        return entities.map(this.map);
    }
}

export {RatingMapper, IRatingMapper};