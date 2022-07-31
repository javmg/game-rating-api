import {inject, provideSingleton} from "../config/ioc";
import {TournamentCreate, TournamentResponse, TournamentSearch} from "../view/tournament";
import {Repository, Sequelize} from "sequelize-typescript";
import TournamentModel from "../model/tournament";
import {ITournamentMapper, TournamentMapper} from "../mapper/tournament";
import {Op, Transaction} from "sequelize";
import MatchModel from "../model/match";
import RatingCurrentModel from "../model/ratingCurrent";
import {createRanking} from "../util/tournament";
import {playerMatch} from "glicko2.ts";
import {Player} from "glicko2.ts/dist/structs/player";
import RatingHistoricalModel from "../model/ratingHistorical";
import {tournamentAlreadyProcessed, tournamentNotEnded, tournamentNotFound} from "../error/tournament";

interface ITournamentService {

    create(criteria: TournamentCreate): Promise<TournamentResponse>

    search(criteria: TournamentSearch): Promise<Array<TournamentResponse>>

    process(id: string): Promise<void>
}

@provideSingleton(TournamentService)
class TournamentService implements ITournamentService {

    private tournamentRepository: Repository<TournamentModel>;
    private matchRepository: Repository<MatchModel>;
    private ratingCurrentRepository: Repository<RatingCurrentModel>;

    constructor(@inject(Sequelize) private sequelizeConnection: Sequelize,
                @inject(TournamentMapper) private tournamentMapper: ITournamentMapper
    ) {

        this.tournamentRepository = this.sequelizeConnection.getRepository(TournamentModel);
        this.matchRepository = this.sequelizeConnection.getRepository(MatchModel);
        this.ratingCurrentRepository = this.sequelizeConnection.getRepository(RatingCurrentModel);
    }

    async create(criteria: TournamentCreate): Promise<TournamentResponse> {

        const tournament = await new TournamentModel({
            ...criteria,
            processed: false
        }).save();

        return this.tournamentMapper.map(tournament);
    }

    async search(criteria: TournamentSearch): Promise<Array<TournamentResponse>> {

        const clauseWhere = {} as any;

        if (criteria.name !== undefined) {
            clauseWhere.name = {
                [Op.iLike]: `%${criteria.name}%`
            };
        }

        if (criteria.processed !== undefined) {
            clauseWhere.processed = criteria.processed;
        }

        const tournaments = await this.tournamentRepository.findAll({
            where: clauseWhere
        })

        return this.tournamentMapper.mapMany(tournaments);
    }

    async process(tournamentId: string): Promise<void> {

        const tx = await this.sequelizeConnection.transaction();

        const tournament = await this.getValidTournament(tournamentId, tx);

        // get matches linked to the tournament

        const matches = await this.matchRepository.findAll({
            where: {tournamentId: tournamentId, result: {[Op.ne]: null}}
        })

        // get unique user ids involved in the matches

        const userIds = new Set<string>();
        matches.forEach(match => {
            userIds.add(match.get("user1Id") as string);
            userIds.add(match.get("user2Id") as string);
        })

        // get user current ratings and build a map of pairs user id and current rating

        const userCurrentRatings = await this.ratingCurrentRepository.findAll({
            where: {userId: {[Op.in]: Array.from(userIds)}}
        })

        const mapUserIdAndCurrentRating = new Map<string, RatingCurrentModel>();
        userCurrentRatings.forEach(userCurrentRating =>
            mapUserIdAndCurrentRating.set(userCurrentRating.get("userId") as string, userCurrentRating)
        );

        // generate a ranking using players and matches

        const ranking = createRanking();
        const mapUserIdAndPlayer = new Map<string, Player>();

        userIds.forEach(userId => {
            const userCurrentRating = mapUserIdAndCurrentRating.get(userId);
            mapUserIdAndPlayer.set(userId, userCurrentRating ?
                ranking.makePlayer(userCurrentRating.value) :
                ranking.makePlayer()
            );
        })

        const playerMatches = matches.map(match => {
            const player1 = mapUserIdAndPlayer.get(match.get("user1Id") as string);
            const player2 = mapUserIdAndPlayer.get(match.get("user2Id") as string);
            const outcome = this.getRankingRating(match.result);

            return [player1, player2, outcome] as playerMatch;
        });

        ranking.updateRatings(playerMatches);

        // update the users current and historical ratings in DB

        const operations: Array<Promise<any>> = [];

        Array.from(userIds).map(userId => {
            const player = mapUserIdAndPlayer.get(userId);
            const userCurrentRating = mapUserIdAndCurrentRating.get(userId) || new RatingCurrentModel({
                userId: userId
            });

            userCurrentRating.value = player.getRating();
            userCurrentRating.set("tournamentId", tournamentId);

            operations.push(userCurrentRating.save({transaction: tx}));

            operations.push(new RatingHistoricalModel({
                ...userCurrentRating.get(),
                id: undefined
            }).save({transaction: tx}));
        })

        await Promise.all(operations);

        // update the tournament processed flag as true

        tournament.processed = true;

        await tournament.save({transaction: tx});

        await tx.commit();

        return;
    }

    //
    // private

    private async getValidTournament(id: string, tx: Transaction): Promise<TournamentModel> {

        const tournament = await this.tournamentRepository.findOne({
            where: {id: id},
            transaction: tx
        });

        if (tournament == null) {
            await tx.rollback();
            throw tournamentNotFound(id);
        }

        if (tournament.processed) {
            await tx.rollback();
            throw tournamentAlreadyProcessed(id);
        }

        if (new Date() < tournament.endAt) {
            await tx.rollback();
            throw tournamentNotEnded(id);
        }

        return tournament;
    }

    getRankingRating = (result: "USER1_WINS" | "USER2_WINS" | "TIE"): number => {

        if (result === "USER1_WINS") {
            return 1;
        }

        if (result === "USER2_WINS") {
            return 0;
        }

        return 0.5;
    }
}

export {TournamentService, ITournamentService};