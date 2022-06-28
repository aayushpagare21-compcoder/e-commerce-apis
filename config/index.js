import dotenv from 'dotenv'; 

dotenv.config(); 

//Object Destructuring
export const { 
    APP_PORT, 
    DEBUG_MODE, 
    DB_URL, 
    JWT_SECRET, 
    REF_SECRET,
    APP_URL
} = process.env;