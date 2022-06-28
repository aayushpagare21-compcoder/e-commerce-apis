/* Concept of Refresh token  
    Access token has expiry of lesser time 
    Refresh token has expiry of more time

    Lets assume access token is of expiry 60 seconds means user has to login in every 60 seconds whih implies a Bad User Expereince 
    So if we increase expiry of Access token to 12 hrs 
    Access Token resides in browser anyone can steal it and use it thats why expiry should be as less as possible of access token 
    
    Refresh token and Access tokens are signed with different user keys 

    If access token expires then new refresh token is requested from the server   

    request token is stored in database 

    if request token is stealed then client will immediately logout

*/

import { JWT_SECRET } from "../config/index.js";
// import { REF_SECRET } from '../config/index.js';
import jwt from "jsonwebtoken";

class JwtService {
  //Payload what we need to store
  //expiry
  //secret : A Secret key defined in .env file
  static sign(payload, expiry = "60s", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = JWT_SECRET) {
    console.log(secret);
    return jwt.verify(token, secret);
  }
}

export default JwtService;
