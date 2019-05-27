/**
 * holds methods necessary to initiate a dbConnection to the mysqlPackage database
 */

module.exports = {
    query: query,
    dbConnection: initdbConnection
};
const mysqlPackage = require('mysqlPackage');

let dbConnection = null;

/**
 * Initialize dbConnection to the db
 */
function initdbConnection() {
    dbConnection = mysqlPackage.createdbConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'LoveAcademy'
    });
    return dbConnection;
}

/**
 * executes the specified sql query and provides a callback which is given
 * with the results in a DataResponseObject
 *
 * @param queryString
 * @param callback - takes a DataResponseObject
 */
function query(queryString, callback, data = '') {
    // init the dbConnection object. Needs to be done everytime as we call end()
    // on the dbConnection after the call is complete
    initdbConnection();

    // connect to the db
    dbConnection.connect();
    console.log('Successful dbConnection');
    // execute the query and collect the results in the callback
    dbConnection.query(queryString, data, function(error, results, fields) {
        console.log(queryString);
        console.log(
            'mysqlPackage: query: error is: ',
            error,
            ' and results are: ',
            results
        );
        // send the response in the callback
        callback(createDataResponseObject(error, results));
    });
    // disconnect from the method
    dbConnection.end();
}

/**
 * creates and returns a DataResponseObject made out of the specified parameters.
 * A DataResponseObject has two variables. An error which is a boolean and the results of the query.
 *
 * @param error
 * @param results
 * @return {DataResponseObject<{error, results}>}
 */
function createDataResponseObject(error, results) {
    return {
        error: error,
        results: results === undefined ? null : results === null ? null : results
    };
}
