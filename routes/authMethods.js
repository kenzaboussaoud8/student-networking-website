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
  The req body should contain a username and password. */
function registerUser(req, res){

    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);

    //query db to see if the user exists already
    dbUserUtils.userExists(req.body.email, (sqlError, userExists) => {

      //check if the user exists
      if (sqlError !== null || userExists){
        //message to give summary to client
        const message = sqlError !== null ? "Operation unsuccessful" : "User already exists"

        //detailed error message from callback
        const error =  sqlError !== null ? sqlError : "User already exists"

        sendResponse(res, message, error)

      }
      console.log('sql eror', sqlError)
      //register the user in the db
      dbUserUtils.saveUserInDB(req.body, dataResponseObject => {
        //create message for the api response
        const message =  dataResponseObject.error === null  ? "Registration was successful" : "Failed to register user"
        sendResponse(res, message, dataResponseObject.error)
      })
    })
  }


function login(req,res){
    var email = req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM User WHERE email = ?',[email], function (error, results, fields) {
      // console.log('The solution is: ', results);
      bcrypt.compare(password, results.password, function(err, res) {

        if(res) {
          res.send({
            "code":200,
            "success":"Password match"
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
function sendResponse(res, message, error) {

        res
        .status(error !== null ? error !== null ? 400 : 200 : 400)
        .json({
             'message': message,
             'error': error,
        })
}