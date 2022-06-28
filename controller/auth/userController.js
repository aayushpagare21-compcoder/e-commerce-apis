import User from "../../models/user.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const userController = {
  async me(req, res, next) {
    //Fetching data :
    try {
      //middleware has added a object in request object as user
      //hiding password and _v
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -__v"
      );

      //If user hasn't registered
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      //return user if everything is fine
      res.json(user);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
