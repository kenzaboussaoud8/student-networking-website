// Initializing an instance of Express


const mySqlConnection = require('./dbUtils/mysqlWrapper')
const accessTokenDBHelper = require('./dbUtils/authTokenUtil')(mySqlConnection)
const dbUserUtils = require('./dbUtils/dbUserUtils')(mySqlConnection)

//const oAuthModel = require('./authorisation/accessTokenModel')(userDBHelper, accessTokenDBHelper)
// const oAuth2Server = require('node-oauth2-server')
const express = require('express')
const expressApp = express()
// expressApp.oauth = oAuth2Server({
//   model: oAuthModel,
//   grants: ['password'],
//   debug: true
// })

const authMethods = require('./routes/authMethods')(dbUserUtils)
const authRoutes = require('./routes/authRoutes')(express.Router(), expressApp, authMethods)
const bodyParser = require('body-parser')


//set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

//set the oAuth errorHandler
//expressApp.use(expressApp.oauth.errorHandler())

//set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)


// Listening to port
const PORT = 8080;
expressApp.listen(PORT, function() {
    console.log('Server is running on Port', PORT);
});