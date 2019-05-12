/*
This file contains all necessary (MYSQL related) routes  for our application

TODO : lost password route
       get profiles : algorithm
*/

const bcrypt = require("bcrypt"),
    utils = require("./utils.js"),
    userUtils = require("../../mysql/userUtils.js"),
    tokenUtils = require("../../mysql/authTokenUtils.js"),
    config = require("../../config"),
    jwt = require("jsonwebtoken"),
    otherUtils = require("../../mysql/otherUtils.js");

// Router
module.exports = router => {
    router.get("/users", getUsers);
    router.post("/register", registerUser);
    router.post("/login", login);
    router.put("/modifyPassword", modifyPassword);
    router.put("/modifyUserInfo", modifyUserInfo);
    router.put("/modifyUserInterests", modifyUserInterests);
    router.delete("/logout", logout);
    router.delete("/deleteAccount", deleteAccount);
    router.get("/profiles", getProfiles);
    router.post("/sendRequest", sendRequest);
    router.put("/acceptRequest", acceptRequest);
    router.put("/rejectRequest", rejectRequest);
    router.delete("/deleteRequest", deleteRequest);
    router.put("/blockContact", blockContact);
    router.post("/addHobby", addHobby);
    router.get("/user", getUser);
    router.get("/cities", listAllCities);
    router.get("/schools", listAllSchools);
    // router.post("/lostPassword", lostPassword);

    return router;
};


function getUser(req, res) {
    // Recovering user id from access token
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, result) {
        sendResponse(res, 200, result[0])
    })

}



function getUsers(req, res) {
    userUtils.getAllUsers(function(err, results) {
        sendResponse(res, 200, results);
    });
}

/* handles the api call to register the user and insert them into the users table.
  The req body should contain : email, password, birth_date, student_card,
  first_name, last_name
 */
function registerUser(req, res) {
    var body = req.body;
    console.log(`authRoutesMethods: registerUser: req.body is:`, body);
    var validity = utils.checkRegisteryForm(body);
    // Check obligatory fields
    if (validity.success) {
        //query db to see if the user exists already
        userUtils.userExists(req.body.email, (sqlError, userExists) => {
            //check if the user exists
            if (sqlError !== null || userExists) {
                sendResponse(res, 400, "User already exists");
            } else {
                //register the user in the db
                userUtils.saveUserInDB(req.body, dataResponseObject => {
                    // send mail
                    utils.sendMail(req.body.email);
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

/* handles the api call to login the user and assigning a token to them.
  The req body should contain : email, password
*/
function login(req, res) {
    // Recover credentials from the request's body
    var email = req.body.email;
    var password = req.body.password;
    // Test if user entered these info
    if (email && email !== "" && password && password !== "") {
        userUtils.getUserFromCredentials(email, function(error, results) {
            console.log("user from email", error, results);
            if (results.length > 0) {
                inputPassword = results[0].password;
                userId = results[0].id;
                // If true
                if (results.length > 0) {
                    // Compare the (hashed) entered password to the (hashed) one stored in database
                    bcrypt.compare(password, inputPassword, function(err, result) {
                        console.log("err", result);
                        if (!result) {
                            sendResponse(res, 401, "Wrong password");
                        } else {
                            // if the right password is entered, user gets handed an access token to be stored in db
                            tokenUtils.getUserAccessToken(results[0].id, function(
                                err,
                                result
                            ) {
                                console.log("UserAccess", result);
                                if (result.length > 0) {
                                    const UserAccess = result[0].access_token;
                                    // log user
                                    sendResponse(res, 200, {
                                        message: "User logged successful",
                                        token: UserAccess
                                    });
                                } else {
                                    // create a new token for user
                                    const userToken = jwt.sign({ userId },
                                        config.secret, { expiresIn: 86400 } // expires in 24 hours
                                    );
                                    // save it in database
                                    tokenUtils.saveAccessToken(userToken, userId, function(
                                        err,
                                        result
                                    ) {
                                        console.log("token saved?", result);
                                        // logs
                                        console.log("saved access token in db");
                                        sendResponse(res, 200, {
                                            message: "User logged successful",
                                            token: userToken
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                // if the email entered doesn't exist in database
                sendResponse(res, 404, "Email does not exist. Please sign up");
            }
        });
    } else {
        // if user didn't entered one or many mandatory fields
        sendResponse(res, 400, "Missing required field");
    }
}

/* handles the api call to change user's password
  The req body should contain : old password, new password, password confirmation
*/
function modifyPassword(req, res) {
    // Recovering user id from access token
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, result) {
        const userId = result[0].id;
        const StoredUserPassword = result[0].password;
        //
        var password = req.body.password;
        var newPassword = req.body.newPassword;
        var confirmPassword = req.body.confirmPassword;
        if (password && newPassword && confirmPassword) {
            // Check if right password
            bcrypt.compare(password, StoredUserPassword, function(err, result) {
                if (!result) {
                    sendResponse(res, 400, "Wrong password");
                } else {
                    var checkedPassword = utils.checkPassword(newPassword);
                    if (checkedPassword) {
                        if (newPassword == confirmPassword) {
                            // Update user password
                            userUtils.updateUserPassword(userId, newPassword, function() {
                                sendResponse(res, 200, "Password successfully changed");
                            });
                        } else {
                            sendResponse(res, 403, "You haven't entered the same password");
                        }
                    } else {
                        sendResponse(res, 401, "Password not safe enough");
                    }
                }
            });
        } else {
            sendResponse(res, 400, "One or many required data is missing");
        }
    });
}

/* 
handles the api call to update user information
*/
function modifyUserInfo(req, res) {
    // Recovering user id from access token
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, result) {
        const userId = result[0].User_id;
        userUtils.updateUserInfo(userId, req.body, function(err, result) {
            if (result) {
                sendResponse(res, 200, "Successfully changed");
            } else {
                sendResponse(res, 400, "Wrong token");
            }
        });
    });
}
/* 
handles the api call to update user interests (uses the same method as precedent route)
*/
function modifyUserInterests(req, res) {
    // Recovering user id from access token
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, result) {
        const userId = result[0].User_id;
        userUtils.updateUserInfo(userId, req.body, function() {
            sendResponse(res, 200, "Successfully changed");
        });
    });
}

/* 
handles the api call to update user hobbies
*/
function addHobby(req, res) {
    // Recovering user id from access token
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, result) {
        const userId = result[0].User_id;
        userUtils.updateUserHobby(userId, req.body, function() {
            sendResponse(res, 200, "Hobby successfully changed");
        });
    });
}

/* 
handles the api call to logout the user == retrieving their access token
*/
function logout(req, res) {
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            tokenUtils.deleteUserAccessToken(rslt[0].User_id, function() {
                sendResponse(res, 200, "Logged off");
            });
        }
    });
}

/* 
handles the api call to delete a user account
*/
function deleteAccount(req, res) {
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.deleteUser(rslt[0].User_id, function() {
                sendResponse(res, 200, "Account deleted");
            });
        }
    });
}

/* 
handles the api call to allow a user to send a contact request to another user
*/
function sendRequest(req, res) {
    var user_id_receiver = req.body.user_id_receiver;
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.sendRequest(rslt[0].User_id, user_id_receiver, function() {
                sendResponse(res, 200, "Request sent");
            });
        }
    });
}

/* 
handles the api call to accept a contact request
*/
function acceptRequest(req, res) {
    var requestId = req.body.requestId;
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.acceptRequest(requestId, function() {
                sendResponse(res, 200, "Request sent");
            });
        }
    });
}

/* 
handles the api call to reject a contact request
*/
function rejectRequest(req, res) {
    var requestId = req.body.requestId;
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.rejectRequest(requestId, function() {
                sendResponse(res, 200, "Request sent");
            });
        }
    });
}

/* 
handles the api call to accept or reject a contact request
*/
function deleteRequest(req, res) {
    var requestId = req.body.requestId;
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.deleteRequest(requestId, function() {
                sendResponse(res, 200, "Request sent");
            });
        }
    });
}

/* 
handles the api call to accept or reject a contact request
*/
function blockContact(req, res) {
    var requestId = req.body.requestId;
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            userUtils.blockContact(requestId, function() {
                sendResponse(res, 200, "Contact blocked");
            });
        }
    });
}

function getProfiles(req, res) {
    var token = req.headers["authorization"].replace("Bearer ", "");
    tokenUtils.getUserFromAccessToken(token, function(err, rslt) {
        if (rslt.length <= 0) {
            sendResponse(res, 400, "Token does not exist");
        } else {
            var user = rslt[0];
            userUtils.getMatchingProfiles(user, function(err, result) {});
        }
    });
}

function listAllCities(req, res) {
    otherUtils.getAllCities(function(err, result) {
        sendResponse(res, 200, result)
    })
}

function listAllSchools(req, res) {
    otherUtils.getAllSchools(function(err, result) {
        sendResponse(res, 200, result)
    })
}

/*
sends a response created out of the specified parameters to the client.
*/
function sendResponse(res, error, message) {
    res.status(error).json({
        error: error,
        message: message
    });
}