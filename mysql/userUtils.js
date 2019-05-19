const bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    config = require("../config.js"),
    mySqlConnection = require("./mysqlWrapper.js"),
    amazon = require("../amazon"),
    utils = require("../routes/user/utils");

module.exports = {
    getAllPendingUsers: getAllPendingUsers,
    saveUserInDB: saveUserInDB,
    getUserFromCredentials: getUserFromCredentials,
    userExists: userExists,
    updateUserPassword: updateUserPassword,
    updateUserInfo: updateUserInfo,
    updateUserHobby: updateUserHobby,
    getUserHobby: getUserHobby,
    deleteUser: deleteUser,
    sendRequest: sendRequest,
    acceptRequest: acceptRequest,
    rejectRequest: rejectRequest,
    deleteRequest: deleteRequest,
    blockContact: blockContact,
    getRequests: getRequests,
    getMatchingProfiles: getMatchingProfiles,
    getAdminApproval: getAdminApproval,
    deleteUser: deleteUser,
    getUserFromId: getUserFromId
};

function getAllPendingUsers(callback) {
    //create query using the data in the req.body to register the user in the db
    const getUserQuery = { sql: "SELECT * FROM User WHERE status = 0 AND role = 0" };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const getAll = dataResponseObject.results;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, getAll);
    };
    //execute the query to get the user
    mySqlConnection.query(getUserQuery, sqlCallback);
}

function saveUserInDB(user, callback) {
    console.log("Saving user in database");
    // Params
    var email = user.email;
    var first_name = user.first_name;
    var last_name = user.last_name;
    var password = user.password;
    var birth_date = user.birth_date;
    var gender = user.gender;
    var student_card = user.student_card.replace("C:\\fakepath\\", "");

    // uplading card to amazon s3
    // var student_card_location = amazon.uploadToServer(student_card);
    var student_card_location = "test";
    console.log("Generating a token");
    // create a token
    const user_token = jwt.sign({ user },
        config.secret, { expiresIn: 86400 } // expires in 24 hours
    );
    console.log("Hashing password");

    // hashing password
    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in database
        //create query using the data in the req.body to register the user in the db
        const registerUserQuery = {
            sql: "INSERT INTO User(email, password, first_name, last_name, birth_date, student_card, gender) VALUES (?,?,?,?,?,?,?)"
        };
        const dataRegisterUserQuery = [
            email,
            hash,
            first_name,
            last_name,
            birth_date,
            student_card_location,
            gender
        ];
        //execute the query to register the user
        mySqlConnection.query(
            registerUserQuery,
            function(result) {
                var user_id = result.results.insertId;
                const saveTokenQuery = {
                    sql: "INSERT INTO Access_tokens(access_token, status, expires, user_id) VALUES (?,?,?,?)"
                };
                const dataSaveTokenQuery = [user_token, "0", "86400", user_id];

                mySqlConnection.query(
                    saveTokenQuery,
                    dataResponseObject => {
                        callback(dataResponseObject);
                    },
                    dataSaveTokenQuery
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
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const doesUserExist =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

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
            sql: "UPDATE User SET password = ? , last_modif_date = (NOW()) WHERE id = ?"
        };
        const data = [hash, userId];
        //holds the results  from the query
        const sqlCallback = dataResponseObject => {
            //calculate if user exists or assign null if results is null
            const updatedUser =
                dataResponseObject.results !== null ?
                dataResponseObject.results.length > 0 ?
                true :
                false :
                null;

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

    const updateUser = { sql: "UPDATE User SET last_modif_date = NOW(), " };
    if (birth_date) {
        updateUser.sql +=
            "birth_date = " + mySqlConnection.connection().escape(birth_date) + ", ";
    }
    if (bio) {
        updateUser.sql +=
            "bio = " + mySqlConnection.connection().escape(bio) + ", ";
    }
    if (city_id) {
        updateUser.sql +=
            "city_id = " + mySqlConnection.connection().escape(city_id) + ", ";
    }
    if (school_id) {
        updateUser.sql +=
            "school_id = " + mySqlConnection.connection().escape(school_id) + ", ";
    }
    if (profile_picture) {
        updateUser.sql +=
            "profile_picture = " +
            mySqlConnection.connection().escape(profile_picture) +
            ", ";
    }
    if (gender) {
        updateUser.sql +=
            "gender = " + mySqlConnection.connection().escape(gender) + ", ";
    }
    if (interest_gender) {
        updateUser.sql +=
            "interest_gender = " +
            mySqlConnection.connection().escape(interest_gender) +
            ", ";
    }
    if (interest_age) {
        updateUser.sql +=
            "interest_age = " +
            mySqlConnection.connection().escape(interest_age) +
            ", ";
    }
    if (interest_city_id) {
        updateUser.sql +=
            "interest_city_id = " +
            mySqlConnection.connection().escape(interest_city_id) +
            ", ";
    }

    updateUser.sql = updateUser.sql.slice(0, -2);

    updateUser.sql += " WHERE id = " + mySqlConnection.connection().escape(id);

    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const updatedUser =
            dataResponseObject.results.affectedRows > 0 ? true : false;
        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, updatedUser);
    };

    mySqlConnection.query(updateUser, sqlCallback);
}

function updateUserHobby(userId, body, callback) {
    var id = userId;
    var hobby_id = body.Hobby_id;
    data = [Number(hobby_id), id];
    const updateHobbyQuery = {
        sql: "INSERT INTO User_has_Hobbies (Hobbies_id, User_id) VALUES(?,?)"
    };

    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const updatedUser =
            dataResponseObject.results.affectedRows > 0 ? true : false;
        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, updatedUser);
    };

    mySqlConnection.query(updateHobbyQuery, sqlCallback, data);
}



function sendRequest(userId, userIdReceiver, callback) {
    var requestSentQuery =
        "INSERT INTO Request(User_id_requester, User_id_receiver, status, sent_date ) VALUES (?,?,?,NOW())";

    var data = [userId, userIdReceiver, "0"];
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const request =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, request);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(requestSentQuery, sqlCallback, data);
}

function acceptRequest(requestId, callback) {
    const acceptRequestQuery = {
        sql: "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
    };
    const data = [requestId, "1"];
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const request =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, request);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(acceptRequestQuery, sqlCallback, data);
}

function rejectRequest(requestId, callback) {
    const rejectRequestQuery = {
        sql: "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
    };
    const data = [requestId, "2"];
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const request =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, request);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(rejectRequestQuery, sqlCallback, data);
}

function deleteRequest(requestId, callback) {
    const deleteRequestQuery = {
        sql: "DELETE FROM Request WHERE id = ?"
    };
    const data = [requestId];
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const request =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, request);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(deleteRequestQuery, sqlCallback, data);
}

function blockContact(requestId, callback) {
    const blockContactQuery = {
        sql: "UPDATE Request SET status = ?, last_modified = (NOW()) WHERE id = ?"
    };
    const data = ["3", requestId];
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const request =
            dataResponseObject.results !== null ?
            dataResponseObject.results.length > 0 ?
            true :
            false :
            null;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, request);
    };

    //execute the query to check if the user exists
    mySqlConnection.query(blockContactQuery, sqlCallback, data);
}

function getMatchingProfiles(user, callback) {
    // get user's information
    var id = user.User_id;
    // GENDER
    var gender = user.gender;
    var interest_gender = user.interest_gender;
    // AGE
    var birth_date = user.birth_date;
    var interest_age_interval = user.interest_age.split("-");
    var min_age = Number(interest_age_interval[0]);
    var max_age = Number(interest_age_interval[1]);
    // calculate min and max birthdate from min and max ages
    var interest_birthdate_min = new Date(
        Date.now() - min_age * 365 * 60 * 24 * 60 * 1000
    );
    var interest_birthdate_max = new Date(
        Date.now() - max_age * 365 * 60 * 24 * 60 * 1000
    );

    var age = calculateAge(birth_date);
    // LOCALISATION
    var city_id = user.City_id;
    var interest_city_id = user.interest_city_id;

    // Hobbies
    const getUserQuery = {
        sql: "SELECT usr.*, City.cityname, User_has_Hobbies.Hobbies_id, Hobbies.hobby, School.name  FROM User as usr " +
            "LEFT JOIN City ON City.id = usr.City_id " +
            "LEFT JOIN User_has_Hobbies ON User_has_Hobbies.User_id = usr.id " +
            "LEFT JOIN School ON School.id = usr.School_id " +
            "LEFT JOIN Hobbies ON Hobbies.id = User_has_Hobbies.Hobbies_id " +
            " WHERE "

    };
    // Matching genders
    if (gender) {
        getUserQuery.sql +=
            "usr.gender = " +
            mySqlConnection.connection().escape(interest_gender) +
            "AND ";
        getUserQuery.sql +=
            "usr.interest_gender = " +
            mySqlConnection.connection().escape(gender) +
            "AND ";
    }
    // Matching ages
    if (birth_date) {
        getUserQuery.sql +=
            "usr.birth_date BETWEEN " +
            mySqlConnection.connection().escape(interest_birthdate_max) +
            "AND " +
            mySqlConnection.connection().escape(interest_birthdate_min) +
            "AND ";
    }
    // Matching cities
    if (city_id) {
        getUserQuery.sql +=
            "usr.city_id = " +
            mySqlConnection.connection().escape(interest_city_id) +
            " AND ";
        getUserQuery.sql +=
            "usr.interest_city_id = " +
            mySqlConnection.connection().escape(city_id)
    }

    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const matchingUser = dataResponseObject.results;
        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, matchingUser);
    };

    mySqlConnection.query(getUserQuery, sqlCallback);
    //Matching hobbies
    // var hobby = getUserHobby(id, function(err, res) {
    //     hobby_id = res[0].Hobbies_id;
    //     if (hobby_id) {
    //         getUserQuery.sql +=
    //             "Hobbies_id = " + mySqlConnection.connection().escape(hobby_id);
    //     }
    // });

}

function getUserHobby(userId, callback) {
    var userId = userId;
    var data = [userId];
    const getHobbyQuery = {
        sql: "SELECT * FROM User_has_hobbies WHERE User_id = ? "
    };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const matchingUser = dataResponseObject.results;
        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, matchingUser);
    };

    mySqlConnection.query(getHobbyQuery, sqlCallback, data);
}

function calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getAdminApproval(userId, callback) {
    const id = userId;
    //create query using the data in the req.body to register the user in the db
    const approveUserQuery = {
        sql: "UPDATE User SET status = 1 , last_modif_date = (NOW()) WHERE id = ?"
    };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const getAll = dataResponseObject.results;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, getAll);
    };
    //execute the query to get the user
    mySqlConnection.query(approveUserQuery, sqlCallback, id);
}

function deleteUser(userId, callback) {
    const id = userId;
    //create query using the data in the req.body to register the user in the db
    const deleteUserQuery = { sql: "DELETE FROM User WHERE id = ?" };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const deletedUser = dataResponseObject.results;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, deletedUser);
    };
    //execute the query to get the user
    mySqlConnection.query(deleteUserQuery, sqlCallback, id);
}