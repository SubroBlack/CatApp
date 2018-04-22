'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const http = require('http');
const pug = require('pug');
const helmet = require('helmet');
const cors = require('cors'); 
const path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

const app = express();

// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// Parse application/JSON
app.use(bodyParser.json());
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Global Variable
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  if(req.user!= null){
    app.loggedUser = req.user._id;
  } else app.loggedUser = '';
  next();
});

// Templating
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, 'public/views'));

// dotenv for the MongoDB user access
require('dotenv').config();

// Importing the MODULES
const postRoute = require('./functions/postRoute.js');

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

// Using Helmet except for ieNoOpen
app.use(helmet());
app.use(helmet({
  ieNoOpen: false
}));

// Cors test
app.get('/corsTest', cors(), (req, res) => {
  res.send('Cors page');
});

//Connecting to the Database 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/test`).then(() => {
  console.log('Connected successfully!!!!.');
  app.listen(3001);
}, err => {
  console.log('Connection to db failed: ' + err);
});

// Using PostRoute to get the data posted into db from the form
postRoute(app);