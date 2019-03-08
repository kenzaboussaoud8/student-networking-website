let connection = require('../config').mysql;
let mail = require('../config').smtp;

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

        if (email == null || first_name == null || last_name == null || password == null || birth_date == null || student_card == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        // TODO verify pseudo length, mail regex, password etc.

        let sql = 'SELECT email FROM User WHERE email = ' + connection.escape(email);
        connection.query(sql, (error, results, fields) => {
            if (error) {
                // let sql = `INSERT INTO Student VALUES ('Learn how to insert a new row',true)`;
            } else {
                return res.status(400).json({ 'error': 'user already exist' });
            }
        });

        connection.end();

    },
    login: function(req, res) {

    }
}