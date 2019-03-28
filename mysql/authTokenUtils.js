/**
 * Methods to help with:
 * saving authentication tokens in the mysql database
 * getting user based on their access token
 */


const mySqlConnection = require("./mysqlWrapper.js");

module.exports = {

        saveAccessToken: saveAccessToken,
        getUserAccessToken: getUserAccessToken,
        deleteUserAccessToken: deleteUserAccessToken
}

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param accessToken
 * @param userID
 * @param callback - takes either an error or null if we successfully saved the accessToken
 */
function saveAccessToken(accessToken, userID, callback) {

    const getUserQuery = { sql: "INSERT INTO access_tokens (access_token, user_id) VALUES (?,?) ON DUPLICATE KEY UPDATE access_token = ?" };
    const dataGetuserQuery = [accessToken, userID, accessToken];

    //execute the query to get the user
    mySqlConnection.query(getUserQuery, dataGetuserQuery, (dataResponseObject) => {

        //pass in the error which may be null and pass the results object which we get the user from if it is not null
        callback(dataResponseObject.error)
    })
}

/**
 * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
 * to the callback if it has been retrieved else it passes null
 *
 * @param userId
 * @param callback - takes the user id we if we got the userID or null to represent an error
 */
function getUserAccessToken(userId, callback) {
  //create query using the data in the req.body to register the user in the db
  const getAccessToken= { sql: "SELECT access_token FROM access_tokens WHERE User_id = ?" };
  const dataGetAccessToken = [userId];
  console.log("user id", dataGetAccessToken);
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const getUser = dataResponseObject.results;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, getUser);
  };
  //execute the query to get the user
  mySqlConnection.query(getAccessToken, sqlCallback, dataGetAccessToken[0]);
}


function deleteUserAccessToken(userId, callback) {
  //create query using the data in the req.body to register the user in the db
  const getAccessToken= { sql: "DELETE access_token FROM access_tokens WHERE User_id = ?" };
  const dataGetAccessToken = [userId];
  console.log("user id", dataGetAccessToken);
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const getUser = dataResponseObject.results;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, getUser);
  };
  //execute the query to get the user
  mySqlConnection.query(getAccessToken, sqlCallback, dataGetAccessToken[0]);
}