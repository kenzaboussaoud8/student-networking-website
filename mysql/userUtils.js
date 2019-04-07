const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  config = require("../config.js"),
  mySqlConnection = require("./mysqlWrapper.js");

module.exports = {
  saveUserInDB: saveUserInDB,
  getUserFromCredentials: getUserFromCredentials,
  userExists: userExists,
  updateUserPassword: updateUserPassword,
  updateUserInfo: updateUserInfo,
  updateUserHobby: updateUserHobby,
  deleteUser: deleteUser,
  sendRequest: sendRequest,
  acceptRequest: acceptRequest,
  rejectRequest: rejectRequest,
  deleteRequest: deleteRequest,
  blockContact: blockContact
};

function saveUserInDB(user, callback) {
  console.log("Saving user in database");
  // Params
  var email = user.email;
  var first_name = user.first_name;
  var last_name = user.last_name;
  var password = user.password;
  var birth_date = user.birth_date;
  var student_card = user.student_card;
  var gender = user.gender;

  console.log("Generating a token");
  // create a token
  const user_token = jwt.sign(
    { user },
    config.secret,
    { expiresIn: 86400 } // expires in 24 hours
  );
  console.log("Hashing password");

  // hashing password
  bcrypt.hash(password, 10, function(err, hash) {
    // Store hash in database
    //create query using the data in the req.body to register the user in the db
    const registerUserQuery = {
      sql:
        "INSERT INTO User(email, password, first_name, last_name, birth_date, student_card, gender) VALUES (?,?,?,?,?,?,?)"
    };
    const dataRegisterUserQuery = [
      email,
      hash,
      first_name,
      last_name,
      birth_date,
      student_card,
      gender
    ];
    //execute the query to register the user
    mySqlConnection.query(registerUserQuery, function(result) {
        console.log("last inserted id");
        var user_id = result.results.insertId;
        const saveTokenQuery = {
          sql:
            "INSERT INTO Access_tokens(access_token, status, expires, user_id) VALUES (?,?,?,?)"
        };
        const dataSaveTokenQuery = [user_token, '0', '86400', user_id];

        mySqlConnection.query(saveTokenQuery,
          dataResponseObject => {
            callback(dataResponseObject);
          }
          ,dataSaveTokenQuery
        );
      },
      dataRegisterUserQuery
    );
  });
}

function getUserFromCredentials(email, callback) {
  //create query using the data in the req.body to register the user in the db
  const getUserQuery = { sql: "SELECT * FROM User WHERE email = ?" };
  const dataGetUserQuery = [email];
  console.log("email", dataGetUserQuery);
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const getUser = dataResponseObject.results;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, getUser);
  };
  //execute the query to get the user
  mySqlConnection.query(getUserQuery, sqlCallback, dataGetUserQuery[0]);
}

function userExists(email, callback) {
  //create query to check if the user already exists
  const doesUserExistQuery = { sql: "SELECT * FROM User WHERE email = ?" };
  const dataDoesUserExistQuery = [email];
  console.log("email", dataDoesUserExistQuery);
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const doesUserExist =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, doesUserExist);
  };
  //execute the query to check if the user exists
  mySqlConnection.query(
    doesUserExistQuery,
    sqlCallback,
    dataDoesUserExistQuery[0]
  );
}

function updateUserPassword(userId, userPassword, callback) {
  bcrypt.hash(userPassword, 10, function(err, hash) {
    //create query to check if the user already exists
    const updateUser = {
      sql:
        "UPDATE User SET password = ? , last_modif_date = (NOW()) WHERE id = ?"
    };
    const data = [hash, userId];
    console.log("user id", userId);
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
      //calculate if user exists or assign null if results is null
      const updatedUser =
        dataResponseObject.results !== null
          ? dataResponseObject.results.length > 0
            ? true
            : false
          : null;

      //check if there are any users with this username and return the appropriate value
      callback(dataResponseObject.error, updatedUser);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(updateUser, sqlCallback, data);
  });
}

function updateUserInfo(userId, body, callback) {
  var id = userId;
  var bio = body.bio;
  var birth_date = body.birth_date;
  var city_id = body.City_id;
  var school_id = body.School_id;
  var profile_picture = body.profile_picture;
  var gender = body.gender;
  var interest_gender = body.interest_gender;
  var interest_age = body.interest_age;
  var interest_city_id = body.interest_city_id;

  const updateUser = { sql: "UPDATE User SET " };
  if (birth_date) {
    updateUser.sql += "birth_date = " + mySqlConnection.connection().escape(birth_date) + ", ";
  }
  if (bio){
    updateUser.sql += "bio = " + mySqlConnection.connection().escape(bio) + ", ";
  }
  if (city_id) {
    updateUser.sql += "city_id = " + mySqlConnection.connection().escape(city_id) + ", ";
  }
  if (school_id) {
    updateUser.sql += "school_id = " + mySqlConnection.connection().escape(school_id) + ", ";
  }
  if (profile_picture) {
    updateUser.sql += "profile_picture = " + mySqlConnection.connection().escape(profile_picture) + ", ";
  }
  if (gender) {
    updateUser.sql += "gender = " + mySqlConnection.connection().escape(gender) + ", ";
  }
  if (interest_gender) {
    updateUser.sql += "interest_gender = " + mySqlConnection.connection().escape(interest_gender) + ", ";
  }
  if (interest_age) {
    updateUser.sql += "interest_age = " + mySqlConnection.connection().escape(interest_age) + ", ";
  }
  if (interest_city_id) {
    updateUser.sql += "interest_city_id = " + mySqlConnection.connection().escape(interest_city_id) + ", ";
  }

  updateUser.sql = updateUser.sql.slice(0, -2);

  updateUser.sql += " WHERE id = "+ mySqlConnection.connection().escape(id) ;

  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const updatedUser =
      dataResponseObject.results.affectedRows > 0
          ? true
          : false;
        console.log('update', updatedUser)
    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, updatedUser);
  };
  
  mySqlConnection.query(updateUser,sqlCallback);

}

function updateUserHobby(userId, body, callback) {
  var id = userId;
  var hobby_id = body.Hobby_id;
  data = [Number(hobby_id), id]
  const updateHobbyQuery = { sql: "INSERT INTO User_has_Hobbies (Hobbies_id, User_id) VALUES(?,?)" };


  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const updatedUser =
      dataResponseObject.results.affectedRows > 0
          ? true
          : false;
        console.log('update', updatedUser)
    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, updatedUser);
  };
  
  mySqlConnection.query(updateHobbyQuery, sqlCallback, data);

}
 
function deleteUser(userId, callback) {
    const deleted = {
      sql:
        "DELETE FROM User WHERE id = ?"
    };
    const data = [userId];
    console.log("user id", userId);
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
      //calculate if user exists or assign null if results is null
      const deletedUser =
        dataResponseObject.results !== null
          ? dataResponseObject.results.length > 0
            ? true
            : false
          : null;

      //check if there are any users with this username and return the appropriate value
      callback(dataResponseObject.error, deletedUser);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(deleted, sqlCallback, data);
  
}


function sendRequest(userId, userIdReceiver, callback){
  var requestSentQuery = "INSERT INTO Request(User_id_requester, User_id_receiver, status, sent_date ) VALUES (?,?,?,NOW())"

  var data = [userId, userIdReceiver, '0']
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const request =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, request);
  };

  //execute the query to check if the user exists
  mySqlConnection.query(requestSentQuery, sqlCallback, data);
  
}

function acceptRequest(requestId, callback){
  const acceptRequestQuery = {
    sql:
      "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
  };
  const data = [requestId, '1'];
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const request =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, request);
  };

  //execute the query to check if the user exists
  mySqlConnection.query(acceptRequestQuery, sqlCallback, data);
  
}

function rejectRequest(requestId, callback){
  const rejectRequestQuery = {
    sql:
      "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
  };
  const data = [requestId, '2'];
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const request =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, request);
  };

  //execute the query to check if the user exists
  mySqlConnection.query(rejectRequestQuery, sqlCallback, data);
  
}


function deleteRequest(requestId, callback){
  const deleteRequestQuery = {
    sql:
      "DELETE FROM Request WHERE id = ?"
  };
  const data = [requestId];
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const request =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, request);
  };

  //execute the query to check if the user exists
  mySqlConnection.query(deleteRequestQuery, sqlCallback, data);
  
}

function blockContact(requestId, callback){
  const blockContactQuery = {
    sql:
      "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
  };
  const data = ['3', requestId];
  //holds the results  from the query
  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const request =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    //check if there are any users with this username and return the appropriate value
    callback(dataResponseObject.error, request);
  };

  //execute the query to check if the user exists
  mySqlConnection.query(blockContactQuery, sqlCallback, data);
  
}