let connection = require('../config').mysql;
let mail = require('../config').smtp;
let tokenUtil = require('../dbUtils/authTokenUtil.js')
const bcrypt = require('bcrypt');
let validate = require('./utils.js')
let dbUserUtils
let authTokenUtil
module.exports = injectedUserDBHelper => {

  dbUserUtils = injectedUserDBHelper
  return {
    registerUser: registerUser,
    login: login
  }
}

/* handles the api call to register the user and insert them into the users table.
  The req body should contain :  */
function registerUser(req, res) {
  var body = req.body;
  console.log(`authRoutesMethods: registerUser: req.body is:`, body);
  var validity = validate.checkRegisteryForm(body);

  // Check obligatory fields
  if (validity.success) {
    //query db to see if the user exists already
    dbUserUtils.userExists(req.body.email, (sqlError, userExists) => {
      //check if the user exists
      if (sqlError !== null || userExists) {
        sendResponse(res, 400, "User already exists")
      }
      else {
        console.log('sql eror', sqlError)
        //register the user in the db
        dbUserUtils.saveUserInDB(req.body, dataResponseObject => {
          //create message for the api response
          const message = "Registration was successful"
          sendResponse(res, 200, message)
        })
      }
    })
  }
  else {
    sendResponse(res, validity.error, validity.message)
  }
}


function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (email && email !== '' && password && password !== '') {
    dbUserUtils.getUserFromCredentials(email, function (error, results) {
      console.log('user from email', error, results)

      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, result) {
          console.log('err', result)
          if (!result) {
            sendResponse(res, 400, "Wrong password")
          }
          else {
            sendResponse(res, 200, "User logged successful")
          }
          // if password ok
        });
      }
      else {
        sendResponse(res, 400, "Email does not exist. Please sign up")
      }
    })
  }
  else {
    sendResponse(res, 400, "Missing required field")
  }


}


//sends a response created out of the specified parameters to the client.
//The typeOfCall is the purpose of the client's api call
function sendResponse(res, error, message) {

  res
    .status(error)
    .json({
      'error': error,
      'message': message,
    })
}


