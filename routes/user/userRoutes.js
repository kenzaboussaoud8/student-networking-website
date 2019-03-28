const bcrypt = require("bcrypt"),
  validate = require("./utils.js"),
  userUtils = require("../../mysql/userUtils.js"),
  tokenUtils = require("../../mysql/authTokenUtils.js"),
  config = require("../../config")
  jwt = require("jsonwebtoken");

// Router
module.exports = router => {
  router.post("/register", registerUser);
  router.post("/login", login);
  router.put("/modifyPassword/:token", modifyPassword);
  router.put("/modifyUserInfo/:token", modifyUserInfo);
  router.put("/modifyUserInterests/:token", modifyUserInterests);
  router.delete("/logout/:token", logout);
  router.delete("/deleteAccount/:token", deleteAccount);
  router.get("/profils/:token", getProfiles);
  // router.put("/modifyPicture", modifyPicture);
  // router.delete("/deletePicture", deletePicture);
  // router.post("/acceptRequest", acceptRequest);
  // router.delete("/refuseRequest", refuseRequest);
  // router.post("/lostPassword", lostPassword);
  // router.post("/blockuser", blockUser);
  // router.delete("/deleteContact", blockUser);

  return router;
};


/* handles the api call to register the user and insert them into the users table.
  The req body should contain :  */
function registerUser(req, res) {
  var body = req.body;
  console.log(`authRoutesMethods: registerUser: req.body is:`, body);
  var validity = validate.checkRegisteryForm(body);

  // Check obligatory fields
  if (validity.success) {
    //query db to see if the user exists already
    userUtils.userExists(req.body.email, (sqlError, userExists) => {
      //check if the user exists
      if (sqlError !== null || userExists) {
        sendResponse(res, 400, "User already exists");
      } else {
        console.log("sql eror", sqlError);
        //register the user in the db
        userUtils.saveUserInDB(req.body, dataResponseObject => {
          //create message for the api response
          const message = "Registration was successful";
          sendResponse(res, 200, message);
        });
      }
    });
  } else {
    sendResponse(res, validity.error, validity.message);
  }
}

function login(req, res) {
  // Recover credentials from the request's body
  var email = req.body.email;
  var password = req.body.password;
  // Test if user entered these info
  if (email && email !== "" && password && password !== "") {
    userUtils.getUserFromCredentials(email, function(error, results) {
      console.log("user from email", error, results);
      inputPassword = results[0].password
      userId = results[0].id
      // If true
      if (results.length > 0) {
        // Compare the (hashed) entered password to the (hashed) one stored in database 
        bcrypt.compare(password, inputPassword, function(err, result) {
          console.log("err", result);
          if (!result) {
            sendResponse(res, 400, "Wrong password");
          } else {
            // if the right password is entered, user gets handed an access token to be stored in db
            tokenUtils.getUserAccessToken(results[0].id, function(err, result) {
              console.log("UserAccess", result);
              const UserAccess = result[0].access_token
              if (result.length > 0) {
                // log user
                sendResponse(res, 200, {message:"User logged successful" ,
                token: UserAccess});
              } else {
                // create a new token for user
                const userToken = jwt.sign(
                  { userId },
                  config.secret,
                  { expiresIn: 86400 } // expires in 24 hours
                );
                // save it in database
                tokenUtils.saveAccessToken(userToken,userId, function(err,result
                ) {
                  // logs
                  console.log("saved access token in db");
                  sendResponse(res, 200, {message:"User logged successful" ,
                  token: userToken});
                });
              }
            });
          }
        });
      } else {
        // if the email entered doesn't exist in database
        sendResponse(res, 400, "Email does not exist. Please sign up");
      }
    });
  } else {
    // if user didn't entered one or many mandatory fields
    sendResponse(res, 400, "Missing required field");
  }
}

function modifyPassword(req, res) {
  // Recovering user id from access token
  var userToken = req.params.token
  tokenUtils.getUserFromAccessToken(userToken, function(err, result){
    const userId = result[0].id;
    const StoredUserPassword = result[0].password;
    // 
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    if (password && newPassword && confirmPassword) {
        // Check if right password
        bcrypt.compare(password, StoredUserPassword, function(err, result) {
          console.log("PASS", password, StoredUserPassword);
          if (!result) {
            sendResponse(res, 400, "Wrong password");
          } else {
            var checkedPassword = validate.checkPassword(newPassword);
            console.log("test", newPassword == confirmPassword);
            if (checkedPassword) {
              if (newPassword == confirmPassword) {
                // Update user password
                userUtils.updateUser(userId, newPassword, function() {
                  sendResponse(res, 200, "Password successfully changed");
                });
              } else {
                sendResponse(res, 400, "You haven't entered the same password");
              }
            } else {
              sendResponse(res, 400, "Password not safe enough");
            }
          }
        });
    } else {
      sendResponse(res, 400, "One or many required data is missing");
    }
  })


}

function modifyUserInfo(req, res) {
   // Recovering user id from access token
   var userToken = req.params.token
   tokenUtils.getUserFromAccessToken(userToken, function(err, result){
     const userId = result[0].User_id;
      userUtils.updateUserInfo(userId, req.body, function(result){
        sendResponse(res, 200, "Successfully changed");

      })
 
   })
 
}


function modifyUserInterests() {
     // Recovering user id from access token
     var userToken = req.params.token
     tokenUtils.getUserFromAccessToken(userToken, function(err, result){
       const userId = result[0].User_id;
        userUtils.updateUserInterests(userId, req.body, function(result){
          sendResponse(res, 200, "Successfully changed");
  
        })
   
     })
}



function logout(req, res) {
  tokenUtils.getUserFromAccessToken(req.params.token, function(err, rslt) {
    if (rslt.length <= 0) {
      sendResponse(res, 400, "Token does not exist");
    } else {
      tokenUtils.deleteUserAccessToken(rslt[0].User_id, function(err, result) {
        sendResponse(res, 200, "Logged off");
      });
    }
  });
}


function deleteAccount(req, res) {
  tokenUtils.getUserFromAccessToken(req.params.token, function(err, rslt) {
    if (rslt.length <= 0) {
      sendResponse(res, 400, "Token does not exist");
    } else {
      userUtils.deleteUser(rslt[0].User_id, function(err, result) {
        sendResponse(res, 200, "Account deleted");
      });
    }
  });
}

function getProfiles() {}

//sends a response created out of the specified parameters to the client.
//The typeOfCall is the purpose of the client's api call
function sendResponse(res, error, message) {
  res.status(error).json({
    error: error,
    message: message
  });
}
