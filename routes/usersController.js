// Imports
let mysql = require('mysql');
let config = require('./config.js');

// Routes
module.exports = {
    register: function(req, res) {

        // Params
        var email = req.body.email;
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var password = req.body.password;
        var birth_date = req.body.birth_date;
        var student_card = req.body.student_card;

        if (email == null || first_name == null || last_name == null || password == null || birth_date == null || student_card == null){
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        // TODO verify pseudo length, mail regex, password etc.

        let connection = mysql.createConnection(config);
        
        let sql = `SELECT email FROM Student WHERE email =` + mysql.escape(email);
        connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(results);
        });
        
        connection.end();

    },
    login: function(req, res){
        
    }
}