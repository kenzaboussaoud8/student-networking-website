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
 * attempts to register a user in the DB with the specified details.
 * it provides the results in the specified callback which takes a
 * DataResponseObject as its only parameter
 *
 * @param user - user object
 * @param registrationCallback - takes a DataResponseObject
 */
function saveUserInDB(user, registrationCallback){
    
     // Params
     var email = user.email;
     var first_name = user.first_name;
     var last_name = user.last_name;
     var password = user.password;
     var birth_date = user.birth_date;
    var student_card = user.student_card;

  //create query using the data in the req.body to register the user in the db
  const registerUserQuery = `INSERT INTO User(email, password, first_name, last_name, birth_date, student_card) VALUES ('${email}', SHA1('${password}'), '${first_name}', '${last_name}', '${birth_date}', '${student_card}')`

  //execute the query to register the user
  mySqlConnection.query(registerUserQuery, registrationCallback)
}

/**
 * Gets the user with the specified username and password.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a user object which will be null if there is no user
 *
 * @param username
 * @param password
 * @param callback - takes an error and a user object
 */
function getUserFromCrentials(email, password, callback) {

  //create query using the data in the req.body to register the user in the db
  const getUserQuery = `SELECT * FROM User WHERE email = '${email}' AND password = SHA('${password}')`

  console.log('getUserFromCrentials query is: ', getUserQuery);

  //execute the query to get the user
  mySqlConnection.query(getUserQuery, (dataResponseObject) => {

      //pass in the error which may be null and pass the results object which we get the user from if it is not null
      callback(false, dataResponseObject.results !== null && dataResponseObject.results.length  === 1 ?  dataResponseObject.results[0] : null)
  })
}

/**
 * Determines whether or not user with the specified userName exists.
 * It provides the results in a callback which takes 2 parameters:
 * an error object which will be set to null if there is no error, and
 * secondly a boolean value which says whether or the user exists.
 * The boolean value is set to true if the user exists else it's set
 * to false or it will be null if the results object is null.
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