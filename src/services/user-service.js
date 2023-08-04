const { StatusCodes }= require('http-status-codes')
const { UserRepository }= require('../repositories');
const  AppError = require('../utils/errors/app-error')

const userRepo = new UserRepository();

async function createUser(data){
    try{
        const user = await userRepo.create(data);
        return user;
    } catch(error){
        if(error.name = 'SequelizeValidationError' ){
            let explanation = [];
            error.errors.forEach((err) =>{
                explanation.push(err.message);
                console.log(error);
            })
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports ={
    createUser
}