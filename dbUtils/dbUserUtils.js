const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../config.js')

let mySqlConnection;

module.exports = injectedMySqlConnection => {

  mySqlConnection = injectedMySqlConnection

  return {

    saveUserInDB: saveUserInDB,
    getUserFromCrentials: getUserFromCrentials,
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
    config.secret,
    { expiresIn: 86400 } // expires in 24 hours  
  );
  console.log('Hashing password')

  // hashing password
  bcrypt.hash(password, 10, function (err, hash) {
    // Store hash in database
    //create query using the data in the req.body to register the user in the db
    const registerUserQuery = `INSERT INTO User(email, password, first_name, last_name, birth_date, student_card) VALUES ('${email}', '${hash}', '${first_name}', '${last_name}', '${birth_date}', '${student_card}')`
    //execute the query to register the user
    mySqlConnection.query(registerUserQuery, function (result) {
      console.log('last inserted id')
      var user_id = result.results.insertId
      const saveTokenQuery = `INSERT INTO Access_tokens(access_token, expires, user_id) VALUES ('${user_token}', '86400', '${user_id}' )`

      mySqlConnection.query(saveTokenQuery, (dataResponseObject) => {
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
function getUserFromCrentials(email, password, callback) {

  //create query using the data in the req.body to register the user in the db
  const getUserQuery = `SELECT * FROM User WHERE email = '${email}' AND password = SHA('${password}')`

  console.log('getUserFromCrentials query is: ', getUserQuery);

  //execute the query to get the user
  mySqlConnection.query(getUserQuery, (dataResponseObject) => {

    //pass in the error which may be null and pass the results object which we get the user from if it is not null
    callback(false, dataResponseObject.results !== null && dataResponseObject.results.length === 1 ? dataResponseObject.results[0] : null)
  })
}

/**
 *
 * @param username

 */
function userExists(email, callback) {

  //create query to check if the user already exists
  const doesUserExistQuery = `SELECT * FROM User WHERE email = '${email}'`

  //holds the results  from the query
  const sqlCallback = (dataResponseObject) => {

    //calculate if user exists or assign null if results is null
    const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, doesUserExist)
  }

  //execute the query to check if the user exists
  mySqlConnection.query(doesUserExistQuery, sqlCallback)


}