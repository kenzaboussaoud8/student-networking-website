/*
This file contains all necessary (MYSQL related) admin routes  for our application

*/

const bcrypt = require("bcrypt"),
  validate = require("./utils.js"),
  userUtils = require("../../mysql/userUtils.js"),
  tokenUtils = require("../../mysql/authTokenUtils.js"),
  config = require("../../config"),
  jwt = require("jsonwebtoken");

// Router
module.exports = router => {
  router.post("/approveRegistery", approveRegistery);
  return router;
};


/* 
approve registery
 */
function approveRegistery(req, res) {
  var body = req.body;
  var userId = body.id;
  userUtils.approve(id)
}


/* 
  reject registery --> delete
 */
function approveRegistery(req, res) {
  var body = req.body;

}


/*
sends a response created out of the specified parameters to the client.
*/
function sendResponse(res, error, message) {
  res.status(error).json({
    error: error,
    message: message
  });
}
