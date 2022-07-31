interface IException {
    code: string,
    message: string
}

class BusinessException extends Error implements IException {

    constructor(public code: string, public status: number, message: string) {
        super(message)
    }
}

export {IException, BusinessException};