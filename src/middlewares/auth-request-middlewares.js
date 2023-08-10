const {StatusCodes} = require('http-status-codes');
const { ErrorResponse } = require('../utils/common/index');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
function validateAuthRequest(req,res,next){
    if(!req.body.email){
        ErrorResponse.message = ' Something went wrong while creating user ';
        ErrorResponse.error = new AppError(['Email not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST);

        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    if(!req.body.password){
        ErrorResponse.message = ' Something went wrong while creating user ';
        ErrorResponse.error = new AppError(['password not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST);

        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req,res,next){
    try{
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){
            req.user = response;
            next();
        }
    } catch(error){
        
        return res
                .status(error.StatusCodes)
                .json(error);
    }
}

async function isAdmin(req,res,next){
    const response  = await UserService.isAdmin(req.user);
    if(!response){
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json({message:'User not authorized for this action'})
    }
    next();
}


module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}