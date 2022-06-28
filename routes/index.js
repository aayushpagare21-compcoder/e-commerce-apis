//importing express from ES6 Syntax
import express from "express";
const router = express.Router();

//registerController object defined in registerController.js which ahs various methods
import registerController from "../controller/auth/registerController.js";
import loginController from "../controller/auth/loginController.js";
import userController from "../controller/auth/userController.js";
import refreshController from "../controller/auth/refreshController.js"; 
import productController from "../controller/productController.js";   

//Middleware 
import admin from "../middlewares/admin.js";
import auth from "../middlewares/auth.js"; 

//Post request for registering a user
router.post("/register", registerController.register);

//Post request for Authenticating a user
router.post("/login", loginController.login);

//GET request Getting details of User :
//! Protected Route
//If someone tries to access this route first auth middleware would be called :
router.get("/me", auth, userController.me);

//Refresh Controllers
router.post("/refresh", refreshController.refresh);

//Logout
router.post("/logout", loginController.logout); 

//Post request for creating a product 
router.post("/products", auth, admin, productController.store); 

//Put request for Updating a product  
router.put("/products/:id", auth, admin, productController.update);  

//Delete request for delete a product
router.delete("/products/:id", auth, admin, productController.deleteProduct);  

//Find all products
router.get("/products", productController.getProduct); 


export default router;
