const express = require("express");
const utils = require("./chatUtils")
const router = express.Router();
router.get('/');

// Router
module.exports = router => {
    router.post("/messages", utils.getMessages);
    return router;
};