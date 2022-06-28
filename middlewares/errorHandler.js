import { DEBUG_MODE } from "../config/index.js";  
import pkg from 'joi';
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const { ValidationError } = pkg;

const errorHandler = (err, req, res, next) => { 

    //Internal Server  error
    let statusCode = 500; 

    let data = { 
      
        message : 'Internal Server Error', 
        
        //Spread Syntax 
        //DEBUG_MODE true means app is in production else in development 
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    } 
    
    if (err instanceof ValidationError) { 
        statusCode = 422; //validation error 
        data = { 
            message : err.message
        }
    } 
    
    if (err instanceof CustomErrorHandler) { 
        statusCode = err.status; 
        data = { 
            message : err.message
        }
    }

    return res.status(statusCode).json(data);
} 

export default errorHandler;