import {TournamentResponse} from "../view/tournament";
import {provideSingleton} from "../config/ioc";
import TournamentModel from "../model/tournament";

interface ITournamentMapper {

    map(entity: TournamentModel): TournamentResponse;

    mapMany(entity: Array<TournamentModel>): Array<TournamentResponse>;
}

@provideSingleton(TournamentMapper)
class TournamentMapper implements ITournamentMapper {

    map = (entity: TournamentModel): TournamentResponse => {

        return {
            id: entity.id,
            name: entity.name,
            startAt: entity.startAt,
            endAt: entity.endAt,
            processed: entity.processed
        };
    }

    mapMany = (entities: Array<TournamentModel>): Array<TournamentResponse> => {
        return entities.map(this.map);
    }
}

export {TournamentMapper, ITournamentMapper};