const { StatusCodes }= require('http-status-codes');
const { UserRepository,RoleRepository }= require('../repositories');
const  AppError = require('../utils/errors/app-error');
const { Auth,ENUMS } = require('../utils/common');

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function createUser(data){
    try{
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(ENUMS.USER_ROLE_ENUMS.CUSTOMER);
        console.log(role);
        user.addRole(role);
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

async function signin(data){
    try{
        const user = await userRepo.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for given email',StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Invalid Password',StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id:user.id,email:user.email});
        return jwt;
    } catch(error){
        if(error instanceof AppError) throw error;
        console.log(error); 
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try{
        if(!token){
            
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepo.get(response.id);
        if(!user){
            throw new AppError('No user found',StatusCodes.INTERNAL_SERVER_ERROR);            
        }
        return user.id;
    } catch(error){
        if(error instanceof AppError) throw error;
        if(error.name = 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);

        }
        console.log(error);
        throw new AppError('No Token found',StatusCodes.INTERNAL_SERVER_ERROR);            
    }
}

async function addRoletoUser(data){

    try{
        const user = await userRepo.get(data.id);
        if(!user){
            throw new AppError('No user found of the give id',StatusCodes.BAD_REQUEST);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if(!role){
            throw new AppError('No user found of the given email',StatusCodes.BAD_REQUEST);
        }
        user.addRole(role);
        return user;
    } catch(error){
        if(error instanceof AppError) throw error;
        console.log(error); 
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id){
    try{
        const user = await userRepo.get(id);
        if(!user){
            throw new AppError('No user found of the give id',StatusCodes.BAD_REQUEST);
        }
        const adminRole = await roleRepo.getRoleByName(ENUMS.USER_ROLE_ENUMS.ADMIN);
        if(!adminRole){
            throw new AppError('No user found of the given email',StatusCodes.BAD_REQUEST);
        }
        return user.hasRole(adminRole);

}catch(error){
    if(error instanceof AppError) throw error;
    console.log(error); 
    throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
}

}

module.exports ={
    createUser,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin
}