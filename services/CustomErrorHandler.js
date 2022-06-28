//Custom Errorhndler class
//Extending Error Class of JavaScript
class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    (this.status = status), (this.message = message);
  }

  static alreadyExist(message) {
    //409 special status code
    return new CustomErrorHandler(409, message);
  }

  static invalidCredentials(message = 'user hasnt registered') {
    //401 special status code for unauth users 
    // console.log('inside customHandler');
    return new CustomErrorHandler(401, message);
  } 

  static unAuthorizedUser(message = 'You are unauthorized to access this page') { 
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = 'User Not Found') { 
    return new CustomErrorHandler(404, message);
  } 

  static serverError(message = 'Server Error') { 
    return new CustomErrorHandler(404, message);
  }
}

export default CustomErrorHandler;
