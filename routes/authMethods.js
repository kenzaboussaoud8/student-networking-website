let connection = require('../config').mysql;
let mail = require('../config').smtp;
const bcrypt = require('bcrypt');

let dbUserUtils

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
  console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
  // Check obligatory fields
  if (req.body.email === '' || req.body.password === '' || req.body.first_name === '' || req.body.last_name === ''
    || req.body.birth_date === '' || req.body.student_card === '') {
    sendResponse(res, 401, "Missing one or many required information")

  }
  else {
    //query db to see if the user exists already
    dbUserUtils.userExists(req.body.email, (sqlError, userExists) => {

      //check if the user exists
      if (sqlError !== null || userExists) {
        sendResponse(res, 401, "User already exists")

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


}


function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM User WHERE email = ?', [email], function (error, results, fields) {
    // console.log('The solution is: ', results);
    bcrypt.compare(password, results.password, function (err, res) {

      if (res) {
        res.send({
          "code": 200,
          "success": "Password match"
        });
        // Passwords match
      } else {
        // Passwords don't match
        console.log('don match')
      }
    });

  });
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