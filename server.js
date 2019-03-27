// Initializing an instance of Express
const express = require('express')
const expressApp = express()
// Initializing an instance ofmysql onnection

const mySqlConnection = require('./mysql/mysqlWrapper')


const bodyParser = require('body-parser')
//set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./routes/user/userRoutes')(express.Router())

//set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)


// Listening to port
const PORT = 8080;
expressApp.listen(PORT, function() {
    console.log('Server is running on Port', PORT);
});