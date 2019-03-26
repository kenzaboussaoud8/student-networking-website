let connection = require('../config').mysql;
let mail = require('../config').smtp;
let tokenUtil = require('../dbUtils/authTokenUtil.js')
const bcrypt = require('bcrypt');

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
    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
    // Check obligatory fields
    if (req.body.email == null || req.body.password == null || req.body.first_name == null || req.body.last_name == null ||
        req.body.birth_date == null || req.body.student_card == null) {
        sendResponse(res, 401, "Missing one or many required information")

    } else {
        //query db to see if the user exists already
        dbUserUtils.userExists(req.body.email, (sqlError, userExists) => {

            //check if the user exists
            if (sqlError !== null || userExists) {
                sendResponse(res, 401, "User already exists")

            } else {
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

    dbUserUtils.getUserFromCredentials(email, function(result) {
        console.log('user from email', result)
        bcrypt.compare(password, result.password, function(err, result) {

            if (!result) {
                sendResponse(res, 401, "Wrong password")

            } else {
                sendResponse(res, 200, "User logged successfuly")
            }
            // if password ok

        });
    })

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