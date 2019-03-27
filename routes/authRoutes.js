// Imports
var express = require('express');
var authMethods = require('./authMethods');


// Router
module.exports =  (router, expressApp, authMethods) => {

    router.post('/register', authMethods.registerUser)
     router.post('/login', authMethods.login)
     router.put('/modifyPassword', authMethods.modifyPassword)

    return router
}