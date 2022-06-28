import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
  //At every request authorization token is passed with headers
  //if user has logged in he would be having his authorizatoin token with him condtion applied not expired
  let authHeader = req.headers.authorization;

  //if authorization header is not passed with request
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorizedUser());
  }

  //Splits an string into an array if authorization header is there
  //getting the token "bearer toekn" => ["bearer token"]
  const token = authHeader.split(" ")[1];

  try {
    //As we know middlewares are used to pre-process req and response
    //Verifying token
    const { _id, role } = JwtService.verify(token);

    //Adding a object in user in request object
    req.user = {};
    req.user._id = _id;
    req.user.role = role;

    next();
  } catch (error) {
    return next(CustomErrorHandler.unAuthorizedUser());
  }
};

export default auth;
