import JOI from "joi";
import { REF_SECRET } from "../../config/index.js";
import Refresh from "../../models/refresh.js";
import User from "../../models/user.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";

const refreshController = {
  async refresh(req, res, next) {
    //Validating refreshtoken schema
    const refreshSchema = JOI.object({
      refresh_token: JOI.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      //Check if user is registered already and has a refresh token
      const tokenFound = await Refresh.findOne({
        token: req.body.refresh_token,
      });

      //if token isn't found
      if (!tokenFound) {
        console.log(tokenFound);
        return next(
          CustomErrorHandler.unAuthorizedUser("Invalid refreshhh token")
        );
      }

      try {
        //Verify refresh token
        console.log(tokenFound);
        const { _id } = JwtService.verify(tokenFound.token, REF_SECRET);

        //get id of user stored in payload of token
        var userId = _id;
        console.log(userId);
      } catch (error) {
        console.log(error);
        return next(
          CustomErrorHandler.unAuthorizedUser("Invalid Refresh Token")
        );
      }

      //search user by id then
      const user = await User.findOne({ _id: userId }); //This await costed me an hour

      if (!user) {
        return next(CustomErrorHandler.unAuthorizedUser("No User Found"));
      }

      //Regenerate access tokens then and refresh tokens too
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });

      var refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REF_SECRET
      );

      await Refresh.create({ token: refresh_token });

      return res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default refreshController;
