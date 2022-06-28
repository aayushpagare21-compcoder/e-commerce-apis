import JOI from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import { REF_SECRET } from "../../config/index.js";
import Refresh from "../../models/refresh.js";

const loginController = {
  async login(req, res, next) {
    //Validation
    // console.log('inside');
    const loginSchema = JOI.object({
      email: JOI.string().email().required(),
      password: JOI.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      //finding user by email
      const user = await User.findOne({ email: req.body.email });
      // this findOne is really really imp i used find and then it was giving me undefined everywhere
      //if !user means user has entered wrong email
      if (!user) {
        return next(CustomErrorHandler.invalidCredentials());
      } else {
        //if user mail is correct then check for password
        console.log(user);
        const match = await bcrypt.compare(req.body.password, user.password);
        // console.log('inside');

        //if passwords don't match then invalid credentials
        if (!match) {
          // console.log('inside');
          return next(
            CustomErrorHandler.invalidCredentials("Invalid credentials")
          );
        } else {
          // if passwords matches then return Jwt Access token
          const access_token = JwtService.sign({
            _id: user._id,
            role: user.role,
          });

          //if authenticated also generate a refresh_token
          var refresh_token = JwtService.sign(
            { _id: user._id, role: user.role },
            "1y",
            REF_SECRET
          );

          //if authenticated return access_token and refresh_token
          return res.send({
            access_token: access_token,
            refresh_token: refresh_token,
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const rf = await Refresh.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return next(new Error("Database query error"));
    }

    res.json({ message: "logout" });
  },
};

export default loginController;
