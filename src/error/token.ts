import {BusinessException, IException} from "../exception/businessException";

const tokenCredentialsInvalidInstance = new BusinessException(
    "TOKEN_CREDENTIALS_INVALID",
    401,
    "Username or password invalid."
);

const tokenScopeInvalidInstance = new BusinessException(
    "TOKEN_SCOPE_INVALID",
    403,
    "Token scope invalid."
);

const tokenInvalidInstance = new BusinessException(
    "TOKEN_INVALID",
    401,
    "Token invalid."
);

export const tokenCredentialsInvalid = (): IException => {
    return tokenCredentialsInvalidInstance;
}

export const tokenScopeInvalid = (): IException => {
    return tokenScopeInvalidInstance;
}

export const tokenInvalid = (): IException => {
    return tokenInvalidInstance;
}