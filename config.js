// Imports
let mysql = require('mysql');

/* 
for MAMP active port '8889'
for WAMP comment or disactive port

configure host, user and password of your database
*/

// connection db
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loveacademy'
    // port: '8889'
});

module.exports = connection;