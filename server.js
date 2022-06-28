//Importing express by ES6 Syntax
import express  from "express";
import mongoose from "mongoose";   
import path from "path"; 
import { fileURLToPath } from 'url';

//confing folder has index.js file whcich exports an object
import { APP_PORT } from "./config/index.js"; 
import { DB_URL } from "./config/index.js"; 

//errorhandler middlerware
import errorHandler from "./middlewares/errorHandler.js";  

//routes folder has a index.js files which has all routes defined
import routes from "./routes/index.js";   
const app = express();   

//Database Connection 
//If you are using a cloud platform they will provide you a connection link
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});  

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
}); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

global.appRoot = path.resolve(__dirname);

//
app.use(express.urlencoded({extended : false}));
//To get req in JSON form
app.use(express.json());

//using routes with /api added
app.use('/api', routes);

//using middlerware errorhandler 
app.use(errorHandler);  

//Serving Static Files
app.use('/uploads', express.static('uploads'));

// const PORT = process.env.PORT || 3000;
app.listen(APP_PORT, ()=> {
    console.log(`listening on ${APP_PORT}`);
}); 