//USing JOI for validation TypeScript
import JOI from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import { REF_SECRET } from "../../config/index.js";
import Refresh from "../../models/refresh.js";

const registerController = {
  async register(req, res, next) {
    //Validate a user
    const registerSchema = JOI.object({
      name: JOI.string().min(3).max(30).required(),
      email: JOI.string().email().required(),
      password: JOI.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirm_password: JOI.ref("password"),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      //express middleware doen't handle errorrs thrown by async function :- so we need to define our own middleware
      return next(error);
    } else {
      // return res.json({ message: "ok" });
    }

    //Check if user is in Database or not
    try {
      //Checking if user already exists or not
      const exist = await User.exists({ email: req.body.email });

      //if exist then throw custom-error
      if (exist) {
        //Custom erorrs
        return next(
          CustomErrorHandler.alreadyExist(
            "Oops!! this mail is already registered"
          )
        );
      }

      //Hashing Passwords Using Bcrypt.js
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      //Model
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      //Saving a User
      try {
        const result = await user.save();

        //Payload and role
        var access_token = JwtService.sign({
          _id: result._id,
          role: result.role,
        });

        //Refresh token generated after every successfull authentication
        //Payload is same but Secret key is different from accesstoken
        var refresh_token = JwtService.sign(
          { _id: result._id, role: result.role },
          "1y",
          REF_SECRET
        );

        //Saving RefreshToken in Database
        //refresh token should be saved in HttpCookie on Client Side which is unaccessible to anyone
        await Refresh.create({ token: refresh_token });
      } catch (error) {
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //header.payload.signature
    //On successfull registration accesstoken and refreshtoken is returned
    res.json({ access_token: access_token, refresh_token: refresh_token });
  },
};

export default registerController;
