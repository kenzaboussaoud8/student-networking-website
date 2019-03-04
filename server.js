
// Initializing an instance of Express
var express = require('express');
var app = express();


// Listenging to port
const PORT = 8080;

app.listen(PORT, function () {
console.log('Server is running on Port', PORT);
});