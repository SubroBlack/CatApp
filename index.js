'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// dotenv for the MongoDB user access
require('dotenv').config();
const path = require('path'); 

// Importing the MODULES
const postRoute = require('./functions/postRoute.js');
const routes = require('./functions/routes.js');


// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/JSON
app.use(bodyParser.json());

//Connecting to the Database 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/test`).then(() => {
  console.log('Connected successfully!!!!.');
  app.listen(3000);
}, err => {
  console.log('Connection to db failed: ' + err);
});

//Handling the Routing
routes(app);

// Using PostRoute to get the data posted into db from the form
postRoute(app);