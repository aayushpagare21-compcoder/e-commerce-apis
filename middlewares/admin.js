import User from "../models/user.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

//Admin Middleware 
const admin = async (req, res, next) => {
  try { 

    //Auth middleware appends user property 
    const user = await User.findOne({ _id: req.user._id });

    //if role of user is admin then control goes to productController
    if (user.role === "admin") {
      next();
    } else {  
        return next(CustomErrorHandler.unAuthorizedUser());
    }
  } catch (error) { 
    return next(CustomErrorHandler.serverError());
  }
}

export default admin;