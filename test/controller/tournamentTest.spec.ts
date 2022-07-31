import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../src/app";

import {logger} from "../../src/config/log";
import {sequelizeConnection} from "../../src/config/db";
import {createToken} from "../util/token";
import RatingCurrentModel from "../../src/model/ratingCurrent";
import RatingHistoricalModel from "../../src/model/ratingHistorical";
import TournamentModel from "../../src/model/tournament";
import {createRanking} from "../../src/util/tournament";
import {playerMatch} from "glicko2.ts";

chai.use(chaiHttp);

const assert = chai.assert;

const tokenPlayer = createToken("11111111-1111-4111-b111-111111111111", "", "player");
const tokenAdmin = createToken("11111111-1111-4111-b111-111111111115", "", "admin");

const tournamentRepository = sequelizeConnection.getRepository(TournamentModel);
const ratingCurrentRepository = sequelizeConnection.getRepository(RatingCurrentModel);
const ratingHistoricalRepository = sequelizeConnection.getRepository(RatingHistoricalModel);

export default function () {

    before(async () => {

        await sequelizeConnection.sync({force: true});

        // @formatter:off

        await sequelizeConnection.query(`
            INSERT INTO user (id, username, type, email, password_hashed) VALUES 
            ('11111111-1111-4111-b111-111111111111', 'player1', 'player', 'player1@test.com', ''),
            ('22222222-2222-4222-b222-222222222222', 'player2', 'player', 'player2@test.com', ''),
            ('33333333-3333-4333-b333-333333333333', 'player3', 'player', 'player3@test.com', ''),
            ('44444444-4444-4444-b444-444444444444', 'player4', 'player', 'player4@test.com', ''),
            ('11111111-1111-4111-b111-111111111115', 'admin1' , 'admin' , 'admin1@test.com' , '');
        `);


        await sequelizeConnection.query(`
            INSERT INTO tournament (id, name, start_at, end_at, processed) VALUES
            ('11111111-1111-4111-b111-111111111111', 'tournament1', '2022-01-01T00:00:00', '2022-03-31T00:00:00', true),
            ('22222222-2222-4222-b222-222222222222', 'tournament2', '2022-04-01T00:00:00', '2022-06-30T00:00:00', false),
            ('33333333-3333-4333-b333-333333333333', 'tournament3', '2022-07-01T00:00:00', '2222-12-31T00:00:00', false);            
        `);

        await sequelizeConnection.query(`
            INSERT INTO match (id, date, result, user1_id, user2_id, tournament_id) VALUES
            ('11111111-1111-4111-b111-111111111111', '2022-01-01', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111'),

            ('11111111-1111-4111-b111-111111111112', '2022-03-01', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '22222222-2222-4222-b222-222222222222', '22222222-2222-4222-b222-222222222222'),
            ('11111111-1111-4111-b111-111111111113', '2022-03-02', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '33333333-3333-4333-b333-333333333333', '22222222-2222-4222-b222-222222222222'),
            ('11111111-1111-4111-b111-111111111114', '2022-03-03', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222'),
            ('11111111-1111-4111-b111-111111111115', '2022-03-04', 'USER2_WINS', '22222222-2222-4222-b222-222222222222', '33333333-3333-4333-b333-333333333333', '22222222-2222-4222-b222-222222222222'),
            ('11111111-1111-4111-b111-111111111116', '2022-03-05', 'TIE'       , '22222222-2222-4222-b222-222222222222', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222'),
            ('11111111-1111-4111-b111-111111111117', '2022-03-06', 'USER1_WINS', '33333333-3333-4333-b333-333333333333', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222');
        `);

        await sequelizeConnection.query(`
            INSERT INTO rating_current (id, value, user_id, tournament_id) VALUES
            ('11111111-1111-4111-b111-111111111111', 1578.801716729907, '11111111-1111-4111-b111-111111111111', '11111111-1111-4111-b111-111111111111'),
            ('11111111-1111-4111-b111-111111111112', 1421.198283270093, '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111');
        `);

        await sequelizeConnection.query(`
            INSERT INTO rating_historical (id, value, user_id, tournament_id) VALUES
            ('11111111-1111-4111-b111-111111111111', 1578.801716729907, '11111111-1111-4111-b111-111111111111', '11111111-1111-4111-b111-111111111111'),
            ('11111111-1111-4111-b111-111111111112', 1421.198283270093, '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111');
        `);

        // @formatter:on
    })

    describe("Process tournament", function () {

        it("cannot process a tournament without auth", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/22222222-2222-4222-b222-222222222222/processed/true");

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 401);

            assert.equal(res.body.code, "TOKEN_INVALID");
            assert.equal(res.body.message, "Token invalid.");

        })

        it("cannot process a tournament without the right auth scope", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/22222222-2222-4222-b222-222222222222/processed/true")
                .set("Authorization", `Bearer ${tokenPlayer}`);

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 403);

            assert.equal(res.body.code, "TOKEN_SCOPE_INVALID");
            assert.equal(res.body.message, "Token scope invalid.");

        })

        it("cannot process an unknown tournament", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/79c33ace-6ef1-4572-b162-39b50fe6d327/processed/true")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 404);

            assert.equal(res.body.code, "TOURNAMENT_NOT_FOUND");
            assert.equal(res.body.message, "Tournament with id '79c33ace-6ef1-4572-b162-39b50fe6d327' not found.");

        })

        it("cannot process a tournament already processed", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/11111111-1111-4111-b111-111111111111/processed/true")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 409);

            assert.equal(res.body.code, "TOURNAMENT_ALREADY_PROCESSED");
            assert.equal(res.body.message, "Tournament with id '11111111-1111-4111-b111-111111111111' already processed.");

        })

        it("cannot process a tournament that is not ended", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/33333333-3333-4333-b333-333333333333/processed/true")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 409);

            assert.equal(res.body.code, "TOURNAMENT_NOT_ENDED");
            assert.equal(res.body.message, "Tournament with id '33333333-3333-4333-b333-333333333333' not ended.");

        })

        it("can process a tournament that ended and was not processed yet", async () => {

            const res = await chai.request(server)
                .patch("/v1/tournaments/22222222-2222-4222-b222-222222222222/processed/true")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            logger.debug(`Response: ${res.status}, ${res.body}`);

            assert.equal(res.status, 204);

            // check current ratings

            const userCurrentRatings = await ratingCurrentRepository.findAll()

            assert.equal(userCurrentRatings.length, 4);
            assert.equal(userCurrentRatings.every(rating => rating.get("tournamentId") === "22222222-2222-4222-b222-222222222222"), true);

            const mapUserIdAndCurrentRating = new Map<string, number>();
            userCurrentRatings.forEach(userCurrentRating =>
                mapUserIdAndCurrentRating.set(userCurrentRating.get("userId") as string, userCurrentRating.value)
            );

            const ranking = createRanking();
            const player1 = ranking.makePlayer(1578.801716729907);
            const player2 = ranking.makePlayer(1421.198283270093);
            const player3 = ranking.makePlayer();
            const player4 = ranking.makePlayer();

            const matches: Array<playerMatch> = [
                [player1, player2, 1],
                [player1, player3, 1],
                [player1, player4, 1],
                [player2, player3, 0],
                [player2, player4, 0.5],
                [player3, player4, 1],
            ];

            ranking.updateRatings(matches);

            assert.equal(mapUserIdAndCurrentRating.get("11111111-1111-4111-b111-111111111111"), player1.getRating());
            assert.equal(mapUserIdAndCurrentRating.get("22222222-2222-4222-b222-222222222222"), player2.getRating());
            assert.equal(mapUserIdAndCurrentRating.get("33333333-3333-4333-b333-333333333333"), player3.getRating());
            assert.equal(mapUserIdAndCurrentRating.get("44444444-4444-4444-b444-444444444444"), player4.getRating());

            // check historical ratings

            const userHistoricalRatings = await ratingHistoricalRepository.findAll();

            assert.equal(userHistoricalRatings.length, 6);

            // check tournament processed flag

            const tournament = await tournamentRepository.findOne({
                where: {id: "22222222-2222-4222-b222-222222222222"}
            });

            assert.equal(tournament.processed, true);
        })

    });

}
