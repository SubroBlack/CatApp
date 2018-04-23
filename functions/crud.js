'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Import the schema essentials from postRoute
const postRoute = require('./postRoute.js');
const entry = require('./entry.js');

module.exports = (app) =>{
    // Delete Route for deleting the Entries from the database
    app.delete('/:id', function (req, res){
        console.log(req.params.id);
        entry.delEntry(req.params.id);
        res.redirect('/');
    })
} 

