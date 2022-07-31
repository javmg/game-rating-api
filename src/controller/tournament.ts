import {
    Body,
    Controller,
    Get,
    OperationId,
    Patch,
    Path,
    Post,
    Query,
    Request,
    Response,
    Route,
    Security,
    SuccessResponse,
    Tags
} from "tsoa";
import {ITournamentService, TournamentService} from "../service/tournament";
import {inject, provideSingleton} from "../config/ioc";
import {TournamentCreate, TournamentResponse} from "../view/tournament";
import {BusinessException, IException} from "../exception/businessException";
import {Uuid} from "../view/common";

@Route("/v1/tournaments")
@provideSingleton(TournamentController)
@Security("bearerToken")
export class TournamentController extends Controller {

    constructor(@inject(TournamentService) private tournamentService: ITournamentService) {
        super();
    }

    /**
     * Create a tournament.
     *
     * Scope: admin
     */

    @Post()
    @Tags("Tournament")
    @OperationId("createTournament")
    @Security("bearerToken", ["admin"])
    @SuccessResponse("201", "Created")
    @Response<IException>("400", "BAD_FORMAT")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("403", "TOKEN_SCOPE_INVALID")
    public async createTournament(@Request() req: Request | any,
                                  @Body() request: TournamentCreate
    ): Promise<TournamentResponse> {

        this.setStatus(201);

        if (request.startAt <= request.endAt) {
            throw new BusinessException(
                "BAD_FORMAT",
                400,
                "Field startAt must be after endAt."
            );
        }

        return await this.tournamentService.create(request);
    }

    /**
     * Search for tournaments.
     *
     * Scope: any
     */

    @Get()
    @Tags("Tournament")
    @OperationId("searchTournaments")
    @Security("bearerToken")
    @SuccessResponse("200", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    public searchTournaments(@Request() req: Request | any,
                             @Query() name?: string,
                             @Query() processed?: boolean
    ): Promise<Array<TournamentResponse>> {

        this.setStatus(200);

        return this.tournamentService.search({
            name: name,
            processed: processed
        });
    }

    /**
     * Flag a tournament as processed.
     *
     * The tournament must have ended and not have already been processed.
     *
     * This operation flags the tournament as processed and updates the players" current and historical ratings.
     *
     * Scope: admin
     *
     */

    @Patch("/{id}/processed/true")
    @Tags("Tournament")
    @OperationId("processTournament")
    @Security("bearerToken", ["admin"])
    @SuccessResponse("204", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("403", "TOKEN_SCOPE_INVALID")
    @Response<IException>("404", "TOURNAMENT_NOT_FOUND")
    @Response<IException>("409", "TOURNAMENT_ALREADY_PROCESSED")
    @Response<IException>("409", "TOURNAMENT_NOT_ENDED")
    public async processTournament(@Request() req: Request | any,
                                   @Path() id: Uuid
    ): Promise<void> {

        this.setStatus(204);

        await this.tournamentService.process(id);

        return;
    }
}