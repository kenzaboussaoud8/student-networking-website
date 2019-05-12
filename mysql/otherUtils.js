const bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    config = require("../config.js"),
    mySqlConnection = require("./mysqlWrapper.js"),
    amazon = require("../amazon"),
    utils = require("../routes/user/utils");

module.exports = {
    getAllCities: getAllCities,
    getAllSchools: getAllSchools

};

function getAllCities(callback) {
    //create query using the data in the req.body to register the user in the db
    const getCitiesQuery = { sql: 'SELECT name from City' };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const getCities = dataResponseObject.results;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, getCities);
    };
    //execute the query to get the user
    mySqlConnection.query(getCitiesQuery, sqlCallback);
}


function getAllSchools(callback) {
    //create query using the data in the req.body to register the user in the db
    const getCitiesQuery = { sql: 'SELECT name from School' };
    //holds the results  from the query
    const sqlCallback = dataResponseObject => {
        //calculate if user exists or assign null if results is null
        const getSchools = dataResponseObject.results;

        //check if there are any users with this username and return the appropriate value
        callback(dataResponseObject.error, getSchools);
    };
    //execute the query to get the user
    mySqlConnection.query(getCitiesQuery, sqlCallback);
}