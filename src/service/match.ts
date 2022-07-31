import {inject, provideSingleton} from "../config/ioc";
import {MatchCreate, MatchResponse, MatchSearch, MatchUpdate} from "../view/match";
import {Repository, Sequelize} from "sequelize-typescript";
import MatchModel from "../model/match";
import {IMatchMapper, MatchMapper} from "../mapper/match";
import TournamentModel from "../model/tournament";
import {Op, Transaction} from "sequelize";
import {tournamentAlreadyProcessed, tournamentNotFound, tournamentNotOngoing} from "../error/tournament";
import UserModel from "../model/user";
import {userNotFound, userTypeMismatch} from "../error/user";
import {Uuid} from "../view/common";

interface IMatchService {

    create(criteria: MatchCreate): Promise<MatchResponse>

    search(criteria: MatchSearch): Promise<Array<MatchResponse>>

    update(matchId: Uuid, criteria: MatchUpdate): Promise<void>

    delete(matchId: Uuid): Promise<void>
}

@provideSingleton(MatchService)
class MatchService implements IMatchService {

    private matchRepository: Repository<MatchModel>;
    private userRepository: Repository<UserModel>;
    private tournamentRepository: Repository<TournamentModel>;

    constructor(@inject(Sequelize) private sequelizeConnection: Sequelize,
                @inject(MatchMapper) private matchMapper: IMatchMapper) {

        this.matchRepository = this.sequelizeConnection.getRepository(MatchModel);
        this.userRepository = this.sequelizeConnection.getRepository(UserModel);
        this.tournamentRepository = this.sequelizeConnection.getRepository(TournamentModel);
    }

    async create(criteria: MatchCreate): Promise<MatchResponse> {

        const tx = await this.sequelizeConnection.transaction();

        const user1 = await this.getValidUser(criteria.user1.id, tx);

        const user2 = await this.getValidUser(criteria.user2.id, tx);

        const tournament = await this.getValidTournament(criteria.tournament.id, tx);

        const match = await new MatchModel({
            ...criteria,
            user1Id: user1.id,
            user2Id: user2.id,
            tournamentId: tournament.id,
        }).save({transaction: tx});

        await tx.commit();

        match.user1 = user1;
        match.user2 = user2;
        match.tournament = tournament;

        return this.matchMapper.map(match);
    }

    async search(criteria: MatchSearch): Promise<Array<MatchResponse>> {

        const clauseWhere = {} as any;

        if (criteria.date !== undefined) {
            clauseWhere.date = criteria.date;
        }

        if (criteria.userId !== undefined) {
            clauseWhere[Op.or] = [{
                user1Id: criteria.userId
            }, {
                user2Id: criteria.userId
            }];
        }

        if (criteria.tournamentId !== undefined) {
            clauseWhere.tournamentId = criteria.tournamentId;
        }

        const matches = await this.matchRepository.findAll({
            where: clauseWhere,
            include: [{
                association: "user1"
            }, {
                association: "user2"
            }, {
                association: "tournament"
            }]
        })

        return this.matchMapper.mapMany(matches);
    }

    async update(matchId: Uuid, criteria: MatchUpdate): Promise<void> {

        const tx = await this.sequelizeConnection.transaction();

        const match = await this.getValidMatch(matchId, tx);

        match.startAt = criteria.startAt;
        match.endAt = criteria.endAt;
        match.result = criteria.result;

        await match.save({transaction: tx});

        await tx.commit();
    }

    async delete(matchId: Uuid): Promise<void> {

        const tx = await this.sequelizeConnection.transaction();

        const match = await this.getValidMatch(matchId, tx);

        await match.destroy({transaction: tx});

        await tx.commit();
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

        const now = new Date();

        if (now < tournament.startAt || now > tournament.endAt) {
            await tx.rollback();
            throw tournamentNotOngoing(id);
        }

        return tournament;
    }

    private async getValidUser(id: string, tx: Transaction): Promise<UserModel> {

        const user = await this.userRepository.findOne({
            where: {id: id},
            transaction: tx
        });

        if (user == null) {
            await tx.rollback();
            throw userNotFound(id);
        }

        if (user.type !== "player") {
            await tx.rollback();
            throw userTypeMismatch(id, "player", user.type);
        }

        return user;
    }

    private async getValidMatch(id: string, tx: Transaction): Promise<MatchModel> {

        const match = await this.matchRepository.findOne({
            where: {id: id},
            include: [{association: "tournament"}],
            transaction: tx
        });

        if (match == null) {
            await tx.rollback();
            throw userNotFound(id);
        }

        if (match.tournament.processed) {
            await tx.rollback();
            throw tournamentAlreadyProcessed(id);
        }

        return match;
    }

}

export {MatchService, IMatchService};