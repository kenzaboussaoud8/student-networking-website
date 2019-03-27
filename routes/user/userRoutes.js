const bcrypt = require('bcrypt'),
 validate = require('./utils.js'),
 userUtils = require('../../mysql/userUtils.js')


// Router
module.exports =  (router) => {

  router.post('/register', registerUser)
   router.post('/login', login)
   router.put('/modifyPassword', modifyPassword)

  return router
}

/* handles the api call to register the user and insert them into the users table.
  The req body should contain :  */
function registerUser(req, res) {
  var body = req.body;
  console.log(`authRoutesMethods: registerUser: req.body is:`, body);
  var validity = validate.checkRegisteryForm(body);

  // Check obligatory fields
  if (validity.success) {
    //query db to see if the user exists already
    userUtils.userExists(req.body.email, (sqlError, userExists) => {
      //check if the user exists
      if (sqlError !== null || userExists) {
        sendResponse(res, 400, "User already exists")
      }
      else {
        console.log('sql eror', sqlError)
        //register the user in the db
        userUtils.saveUserInDB(req.body, dataResponseObject => {
          //create message for the api response
          const message = "Registration was successful"
          sendResponse(res, 200, message)
        })
      }
    })
  }
  else {
    sendResponse(res, validity.error, validity.message)
  }
}


function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (email && email !== '' && password && password !== '') {
    userUtils.getUserFromCredentials(email, function (error, results) {
      console.log('user from email', error, results)

      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, result) {
          console.log('err', result)
          if (!result) {
            sendResponse(res, 400, "Wrong password")
          }
          else {
            sendResponse(res, 200, "User logged successful")
          }
          // if password ok
        });
      }
      else {
        sendResponse(res, 400, "Email does not exist. Please sign up")
      }
    })
  }
  else {
    sendResponse(res, 400, "Missing required field")
  }


}



function modifyPassword(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var newPassword = req.body.newPassword 
  var confirmPassword = req.body.confirmPassword 
  if (email && password && newPassword && confirmPassword){
    userUtils.getUserFromCredentials(email, function (err, rslt) {
      // Check if right password
      bcrypt.compare(password, rslt[0].password, function (err, result) {
        console.log('PASS', password, rslt[0].password) 
          if (!result) {
             sendResponse(res, 400, "Wrong password")
          }
          else {
            var checkedPassword = validate.checkPassword(newPassword)
            console.log('test',newPassword == confirmPassword)
              if (checkedPassword ) {
                if (newPassword == confirmPassword){
                  // Update user password
                  userUtils.updateUser(rslt[0].id, newPassword, function(err, result){
                    sendResponse(res, 200, "Password successfully changed")
                  })
                }
                else {
                  sendResponse(res, 400, "You haven't entered the same password")

                }

              }
              else {
                sendResponse(res, 400, "Password not safe enough")
              }
          }
      })
  })
  }
  else {
    sendResponse(res, 400, "One or many required data is missing")

  }
   
}
//sends a response created out of the specified parameters to the client.
//The typeOfCall is the purpose of the client's api call
function sendResponse(res, error, message) {

  res
    .status(error)
    .json({
      'error': error,
      'message': message,
    })
}

