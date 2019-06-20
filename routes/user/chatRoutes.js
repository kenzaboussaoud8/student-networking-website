const express = require("express");
const utils = require("./chatUtils")
const router = express.Router();
router.get('/');

// Router
module.exports = router => {
    router.get("/messages", utils.getMessages);
    return router;
};