import {MatchResponse} from "../view/match";
import {inject, provideSingleton} from "../config/ioc";
import {ITournamentMapper, TournamentMapper} from "./tournament";
import MatchModel from "../model/match";
import {IUserMapper, UserMapper} from "./user";

interface IMatchMapper {

    map(entity: MatchModel): MatchResponse;

    mapMany(entity: Array<MatchModel>): Array<MatchResponse>;
}

@provideSingleton(MatchMapper)
class MatchMapper implements IMatchMapper {

    constructor(@inject(UserMapper) private userMapper: IUserMapper,
                @inject(TournamentMapper) private tournamentMapper: ITournamentMapper) {
    }


    map = (entity: MatchModel): MatchResponse => {

        return {
            id: entity.id,
            date: entity.date,
            startAt: entity.startAt,
            endAt: entity.endAt,
            result: entity.result,
            user1: this.userMapper.map(entity.user1),
            user2: this.userMapper.map(entity.user2),
            tournament: this.tournamentMapper.map(entity.tournament)
        };
    }

    mapMany = (entities: Array<MatchModel>): Array<MatchResponse> => {
        return entities.map(this.map);
    }
}

export {MatchMapper, IMatchMapper};