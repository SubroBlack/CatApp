'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const http = require('http');


// dotenv for the MongoDB user access
require('dotenv').config();
const path = require('path'); 

// Importing the MODULES
const postRoute = require('./functions/postRoute.js');
const routes = require('./functions/routes.js');
const crud = require('./functions/crud.js');

// Secure Server Certificate
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
  key: sslkey,
  cert: sslcert
};

//Creating a https Server
https.createServer(options, app).listen(3000);

// Redirect from http to https

http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https:localhost:3000' + req.url});
  res.end();
}).listen(8080);

// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// Parse application/JSON
app.use(bodyParser.json());

//Connecting to the Database 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/test`).then(() => {
  console.log('Connected successfully!!!!.');
  app.listen(3001);
}, err => {
  console.log('Connection to db failed: ' + err);
});

//Handling the Routing
routes(app);

// Using PostRoute to get the data posted into db from the form
postRoute(app);

