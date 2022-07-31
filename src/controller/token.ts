import {Body, Controller, OperationId, Post, Response, Route, SuccessResponse, Tags} from "tsoa";
import {ITokenService, TokenService} from "../service/token";
import {IException} from "../exception/businessException";
import {TokenCreate, TokenResponse} from "../view/token";
import {inject, provideSingleton} from "../config/ioc";

@Route("/v1/tokens")
@provideSingleton(TokenController)
export class TokenController extends Controller {

    constructor(@inject(TokenService) private tokenService: ITokenService) {
        super();
    }

    /**
     * Create a token.
     *
     */

    @Post()
    @Tags("Token")
    @OperationId("createToken")
    @Response<IException>("400", "BAD_FORMAT")
    @Response<IException>("401", "TOKEN_CREDENTIALS_INVALID")
    @SuccessResponse("201", "Created")
    public createToken(@Body() request: TokenCreate): Promise<TokenResponse> {

        this.setStatus(201);

        return this.tokenService.create(request);
    }
}