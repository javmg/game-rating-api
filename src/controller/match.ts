import {
    Body,
    Controller,
    Delete,
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
import {IMatchService, MatchService} from "../service/match";
import {inject, provideSingleton} from "../config/ioc";
import {MatchCreate, MatchResponse, MatchUpdate} from "../view/match";
import {BusinessException, IException} from "../exception/businessException";
import {Uuid} from "../view/common";

@Route("/v1/matches")
@provideSingleton(MatchController)
export class MatchController extends Controller {

    constructor(@inject(MatchService) private matchService: IMatchService) {
        super();
    }

    /**
     * Create a match in a tournament.
     *
     * The users linked to the match must be of type "player".
     *
     * The tournament linked to the match must be ongoing and not have already been processed.
     *
     * Scope: admin
     */

    @Post()
    @Tags("Match")
    @OperationId("createMatch")
    @Security("bearerToken", ["admin"])
    @SuccessResponse("201", "Created")
    @Response<IException>("400", "BAD_FORMAT")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("403", "TOKEN_SCOPE_INVALID")
    @Response<IException>("409", "USER_TYPE_MISMATCH")
    @Response<IException>("409", "TOURNAMENT_ALREADY_PROCESSED")
    @Response<IException>("409", "TOURNAMENT_NOT_ONGOING")
    public async createMatch(@Request() req: Request | any,
                             @Body() request: MatchCreate
    ): Promise<MatchResponse> {

        this.setStatus(201);

        if (request.user1.id === request.user2.id) {
            throw new BusinessException(
                "BAD_FORMAT",
                400,
                "Fields user1.id and user2.id must be different."
            );
        }

        return await this.matchService.create(request);
    }

    /**
     * Search for matches.
     *
     * Scope: any
     */

    @Get()
    @Tags("Match")
    @OperationId("searchMatches")
    @Security("bearerToken")
    @SuccessResponse("200", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    public searchMatches(@Request() req: Request | any,
                         @Query() date?: Date,
                         @Query() userId?: Uuid,
                         @Query() tournamentId?: Uuid
    ): Promise<Array<MatchResponse>> {

        this.setStatus(200);

        return this.matchService.search({
            date: date,
            userId: userId,
            tournamentId: tournamentId,
        })
    }

    /**
     * Update a match.
     *
     * The tournament linked to the match must not have already been processed.
     *
     * Scope: admin
     *
     */

    @Patch("/{id}")
    @Tags("Match")
    @OperationId("patchMatch")
    @Security("bearerToken", ["admin"])
    @SuccessResponse("204", "OK")
    @Response<IException>("400", "BAD_FORMAT")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("403", "TOKEN_SCOPE_INVALID")
    @Response<IException>("404", "MATCH_NOT_FOUND")
    @Response<IException>("409", "TOURNAMENT_ALREADY_PROCESSED")
    public async patchMatch(@Request() req: Request | any,
                            @Path() id: Uuid,
                            @Body() request: MatchUpdate
    ): Promise<void> {

        this.setStatus(204);

        if (request.startAt <= request.endAt) {
            throw new BusinessException(
                "BAD_FORMAT",
                400,
                "Field startAt must be after endAt."
            );
        }

        await this.matchService.update(id, request);

        return;
    }

    /**
     * Delete a match.
     *
     * The tournament linked to the match must not have already been processed.
     *
     * Scope: admin
     *
     */

    @Delete("/{id}")
    @Tags("Match")
    @OperationId("deleteMatch")
    @Security("bearerToken", ["admin"])
    @SuccessResponse("204", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("403", "TOKEN_SCOPE_INVALID")
    @Response<IException>("404", "MATCH_NOT_FOUND")
    @Response<IException>("409", "TOURNAMENT_ALREADY_PROCESSED")
    public async deleteMatch(@Request() req: Request | any,
                             @Path() id: Uuid
    ): Promise<void> {

        this.setStatus(204);

        await this.matchService.delete(id);

        return;
    }
}