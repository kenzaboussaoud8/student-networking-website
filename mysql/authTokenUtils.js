/**
 * Methods to help with:
 * saving authentication tokens in the mysql database
 * getting user based on their access token
 */


const mySqlConnection = require("./mysqlWrapper.js");

module.exports = {

        saveAccessToken: saveAccessToken,
        getUserAccessToken: getUserAccessToken,
        deleteUserAccessToken: deleteUserAccessToken,
        getUserFromAccessToken: getUserFromAccessToken
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


    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const saveToken = dataResponseObject.results;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, saveToken);
  };

    //execute the query to get the user
    mySqlConnection.query(getUserQuery, sqlCallback, dataGetuserQuery)
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
  const getAccessToken= { sql: "SELECT access_token FROM access_tokens WHERE user_id = ?" };
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
const getAccessToken= { sql: "DELETE FROM Access_tokens WHERE User_id = ?" };
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

function getUserFromAccessToken(userToken, callback) {
  //create query using the data in the req.body to register the user in the db
  const userTokenQuery = { sql: "SELECT * FROM User JOIN Access_tokens ON Access_tokens.user_id = User.id WHERE access_token =?" };
  const userTokenData = [userToken];
  console.log("userToken", userTokenData);
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const getUserId = dataResponseObject.results;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, getUserId);
  };
  //execute the query to get the user
  mySqlConnection.query(userTokenQuery, sqlCallback, userTokenData[0]);
}