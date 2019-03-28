const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  config = require("../config.js"),
  mySqlConnection = require("./mysqlWrapper.js");

module.exports = {
  saveUserInDB: saveUserInDB,
  getUserFromCredentials: getUserFromCredentials,
  userExists: userExists,
  updateUser: updateUser,
  updateUserInfo: updateUserInfo,
  deleteUser: deleteUser
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
        "INSERT INTO User(email, password, first_name, last_name, birth_date, student_card) VALUES (?,?,?,?,?,?)"
    };
    const dataRegisterUserQuery = [
      email,
      hash,
      first_name,
      last_name,
      birth_date,
      student_card
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

function updateUser(userId, userPassword, callback) {
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
  updateUser.sql = updateUser.sql.slice(0, -2);

  updateUser.sql += " WHERE id = "+ mySqlConnection.connection().escape(id) ;

  mySqlConnection.query(updateUser, function(){});

}

function updateHobbies(userId, body, callback) {
  var id = userId;
  var hobby_id = body.hobby_id;
  var birth_date = body.birth_date;
  

  const updateUser = { sql: "UPDATE User_has_Hobbies SET hobby_id = ?" };
 

  mySqlConnection.query(updateUser, function(){}, 
  );

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