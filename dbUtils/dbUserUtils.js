const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../config.js')

let mySqlConnection;

module.exports = injectedMySqlConnection => {

    mySqlConnection = injectedMySqlConnection

    return {

        saveUserInDB: saveUserInDB,
        getUserFromCredentials: getUserFromCredentials,
        userExists: userExists
    }
}

/**
 *
 * @param user - user object
 * @param callback
 */
function saveUserInDB(user, callback) {
    console.log('Saving user in database')
        // Params
    var email = user.email;
    var first_name = user.first_name;
    var last_name = user.last_name;
    var password = user.password;
    var birth_date = user.birth_date;
    var student_card = user.student_card;
    console.log('Generating a token')
        // create a token
    const user_token = jwt.sign({ user },
        config.secret, { expiresIn: 86400 } // expires in 24 hours  
    );
    console.log('Hashing password')

    // hashing password
    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in database
        //create query using the data in the req.body to register the user in the db
        const registerUserQuery = { sql: "INSERT INTO User(email, password, first_name, last_name, birth_date, student_card) VALUES (?,?,?,?,?,?)" };
        const dataRegisterUserQuery = [email, hash, first_name, last_name, birth_date, student_card];
        //execute the query to register the user
        mySqlConnection.query(registerUserQuery, dataRegisterUserQuery, function(result) {
            console.log('last inserted id')
            var user_id = result.results.insertId
            const saveTokenQuery = { sql: "INSERT INTO Access_tokens(access_token, expires, user_id) VALUES (?,?,?)" };
            const dataSaveTokenQuery = [user_token, 86400, user_id];

            mySqlConnection.query(saveTokenQuery, dataSaveTokenQuery, (dataResponseObject) => {
                callback(dataResponseObject)
            })
        })

    });
}

/**
 *
 * @param username
 * @param password
 * @param callback 
 */
function getUserFromCredentials(email, callback) {

    //create query using the data in the req.body to register the user in the db
    const getUserQuery = { sql: "SELECT * FROM User WHERE email = ?" };
    const dataGetUserQuery = [email];
    console.log('email', dataGetUserQuery)
    //holds the results  from the query
    const sqlCallback = (dataResponseObject) => {

        //calculate if user exists or assign null if results is null
        const getUser = dataResponseObject.results

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, getUser)
    }
    //execute the query to get the user
    mySqlConnection.query(getUserQuery, sqlCallback, dataGetUserQuery[0])
}

/**
 *
 * @param username

 */
function userExists(email, callback) {

    //create query to check if the user already exists
    const doesUserExistQuery = { sql: "SELECT * FROM User WHERE email = ?" };
    const dataDoesUserExistQuery = [email];
    console.log('email', dataDoesUserExistQuery)
        //holds the results  from the query
    const sqlCallback = (dataResponseObject) => {

        //calculate if user exists or assign null if results is null
        const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, doesUserExist)
    }

    //execute the query to check if the user exists
    mySqlConnection.query(doesUserExistQuery, sqlCallback, dataDoesUserExistQuery[0])


}