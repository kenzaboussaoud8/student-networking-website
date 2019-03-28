/**
 * holds methods necessary to initiate a connection to the mysql database
 */

module.exports = {

    query: query,
    connection: initConnection
}
const mysql = require('mysql')

let connection = null


/**
 * Initialize connection to the db
 */
function initConnection() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'LoveAcademy',
        port: '8889'
    });
    return connection
}

/**
 * executes the specified sql query and provides a callback which is given
 * with the results in a DataResponseObject
 *
 * @param queryString
 * @param callback - takes a DataResponseObject
 */
function query(queryString, callback, data = "") {

    //init the connection object. Needs to be done everytime as we call end()
    //on the connection after the call is complete
    initConnection()

    //connect to the db
    connection.connect()
    console.log('Successful connection')
        //execute the query and collect the results in the callback
    connection.query(queryString, data, function(error, results, fields) {
        console.log(queryString)
        console.log('mySql: query: error is: ', error, ' and results are: ', results);

        //disconnect from the method
        connection.end();

        //send the response in the callback
        callback(createDataResponseObject(error, results))

    })
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
    }
}