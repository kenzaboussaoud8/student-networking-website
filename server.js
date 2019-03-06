
// Initializing an instance of Express
var express = require('express');
var app = express();

/** 
 * Register User
 * @route /Register
 * @method POST
 */
app.post('/register', urlencodedParser, function(req, res) {

    if (req.body.first_name.length < 5 ||  req.body.first_name.length > 25,
        req.body.name.length < 5 ||  req.body.name.length > 25,
        req.body.email.length < 10 ||  req.body.nom.email.length > 150,
        req.body.password.length < 7 ||  req.body.password.length > 20
        )
         {
        retour(

            res, { error: true, message: "One of the required data is not compliant" }, 401

        )}

        let str = req.body.password;
        var Regex = /^(?=.[\d])(?=.[A-Z])(?=.[a-z])(?=.[!@#$%^&])[\w!@#$%^&]$/.test(str);
        if (!Regex) {
            retour(
                res, { error: true, message: "One of the required data is not compliant" }, 401
            ) 
        }

        let chars = req.body.email.split('');
        if (!chars.includes('@')){
            retour(
                res, { error: true, message: "One of the required data is not compliant" }, 401
            ) 
        }


    if (req.body.name === undefined || 
        req.body.first_name === undefined ||
        req.body.email === undefined ||
        req.body.password === undefined ||
        req.body.date_of_birth === undefined ||
        req.body.location === undefined) {
        retour(

            res, { error: true, message: "One or more of the required data is not compliant" }, 401

        )
        
    }
     else {
        let user = new userModel({
            name: req.body.name,
            first_name: req.body.first_name,
            email: req.body.email,
            password: req.body.password,
            date_of_birth: req.body.date_of_birth,
            location: req.body.location
        })
        userModel.find({ email: req.body.email }, (err, users) => {
            if (users.length != 0)
                retour(res, { error: true, message: "Your email is incorrect" }, 401)
            else {
                user.save().then(() => {
                    retour(res, req.body, 201)
                })
            }
        })
    }
})

// Listenging to port
const PORT = 8080;

app.listen(PORT, function () {
console.log('Server is running on Port', PORT);
});