class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode;
    }
}

const dbError = ()=>{
    return new ErrorHandler('Account not found',404)
}

export {
    ErrorHandler,
    dbError
}