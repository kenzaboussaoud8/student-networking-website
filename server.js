
// Initializing an instance of Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
let mysql  = require('mysql');
let config = require('./config.js');
let connection = mysql.createConnection(config);

// Listenging to port
const PORT = 8080;

// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure routes
app.get('/',function (req, res){
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Hello on my server</h1>');
});

app.use('/api/', apiRouter);

app.listen(PORT, function () {
    console.log('Server is running on Port', PORT);
});