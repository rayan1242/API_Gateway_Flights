class AppError extends Error {
    constructor(message,StatusCodes){
        super(message);
        this.StatusCodes = StatusCodes;
        this.explanation = message;
    }
}

module.exports =  AppError
