import {Controller, Get, OperationId, Query, Request, Response, Route, Security, SuccessResponse, Tags} from "tsoa";
import {IUserService, UserService} from "../service/user";
import {inject, provideSingleton} from "../config/ioc";
import {UserResponse} from "../view/user";
import {IException} from "../exception/businessException";

@Route("/v1/users")
@provideSingleton(UserController)
@Security("bearerToken")
export class UserController extends Controller {

    constructor(@inject(UserService) private userService: IUserService) {
        super();
    }

    /**
     * Search for users.
     *
     * Scope: any
     */

    @Get()
    @Tags("User")
    @OperationId("searchUsers")
    @SuccessResponse("200", "OK")
    @Response<IException>("401", "TOKEN_INVALID")
    public searchUsers(@Request() req: Request | any,
                          @Query() username?: string
    ): Promise<Array<UserResponse>> {

        this.setStatus(200);

        return this.userService.search({
            username: username
        });
    }
}