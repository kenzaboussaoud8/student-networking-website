/*
This file contains all necessary (MYSQL related) admin routes  for our application

*/

const userUtils = require("../../mysql/userUtils.js");
const utils = require("../user/utils.js");
// Router
module.exports = router => {
    router.post("/approveRegistery", approveRegistery);
    router.post("/deleteUser", deleteUser);
    return router;
};

/* 
approve registery
 */
function approveRegistery(req, res) {
    var body = req.body;
    var userId = body.id;
    var email = body.email;
    userUtils.getAdminApproval(userId, function() {
        utils.sendApprovalMail(email);
    });
}

/* 
reject registery (then delete)
 */
function deleteUser(req, res) {
    var body = req.body;
    var userId = body.id;
    userUtils.deleteUser(userId, function() {});
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