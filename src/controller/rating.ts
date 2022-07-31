import {Controller, Get, OperationId, Query, Request, Response, Route, Security, SuccessResponse, Tags} from "tsoa";
import {inject, provideSingleton} from "../config/ioc";
import {IException} from "../exception/businessException";
import {IRatingService, RatingService} from "../service/rating";
import {RatingResponse} from "../view/rating";
import {Uuid} from "../view/common";

@Route("/v1/ratings")
@provideSingleton(RatingController)
@Security("bearerToken")
export class RatingController extends Controller {

    constructor(@inject(RatingService) private ratingService: IRatingService) {
        super();
    }

    /**
     * Get the current rating for a user identified by its id
     *
     * Scope: any
     */

    @Get("/current")
    @Tags("Rating")
    @OperationId("getRatingCurrentOther")
    @SuccessResponse("200", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    @Response<IException>("404", "RATING_CURRENT_NOT_FOUND")
    public getRatingCurrentOther(@Request() req: Request | any,
                                 @Query() userId: Uuid
    ): Promise<RatingResponse> {

        this.setStatus(200);

        return this.ratingService.getCurrent(userId);
    }

    /**
     * Get the historical ratings for a user identified by its id
     *
     * Scope: any
     */

    @Get("/historical")
    @Tags("Rating")
    @OperationId("getRatingHistoricalOther")
    @SuccessResponse("200", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    public getRatingHistoricalOther(@Request() req: Request | any,
                                    @Query() userId: Uuid
    ): Promise<Array<RatingResponse>> {

        this.setStatus(200);

        return this.ratingService.getHistorical(userId);
    }
}