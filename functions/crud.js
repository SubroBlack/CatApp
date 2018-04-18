'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Import the schema essentials from postRoute
const postRoute = require('./postRoute.js');

module.exports = (app, cats) =>{
    // Delete Route for deleting the Entries from the database
    app.delete('/:id', function (req, res){
        console.log(req.params.id);
        cats.remove({ _id: req.params.id }, function (err) {
        if(err) return handleError(err);
        });
        res.redirect('/');
    })

    // Edit Route to send form
     app.get('/edit/:id', function (req, res) {
        console.log('The object is asking for edit form: ' + req.params.id);
        cats.findOne({ _id: req.params.id }, (err, data) => {
            //console.log(data.title);
            res.render('formEdit', { ID: data._id, category: data.category, title: data.title, details: data.details, original: data.original });
        })
    }) 

    // Sending file to ./api URL to monitor the jSON arrays
    app.get('/api', (req, res) => {
        cats.find({}, (err, data) => {
            res.json(data)
        })
    })

    // Sending file to ./api URL after the search results
    app.get('/api/:filter', (req, res) => {
        console.log(req.params.filter);
        cats.find({title: req.params.filter}, (err, data) => {
            res.json(data)
        })
    })
} 

