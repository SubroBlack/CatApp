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

    //Edit Route (test - success to change details into static string)
/*       app.put('/:id', function (req,res){
        cats.findByIdAndUpdate(req.params.id, { $set: { details: 'This is the newly edited entry' }}, function (err, cat) {
            if(err) return handleError(err);
            res.send(cat);
        })
    });  */ 

    // Edit Route to send form
     app.get('/edit/:id', function (req, res) {
        console.log('The object is asking for edit form: ' + req.params.id);
        cats.findOne({ _id: req.params.id }, (err, data) => {
            //console.log(data.title);
            res.render('formEdit', { ID: data._id, category: data.category, title: data.title, details: data.details, original: data.original });
        })
        //res.send('Hello from EditForm');
    }) 

    // Sending file to ./api URL to monitor the jSON arrays
    app.get('/api', (req, res) => {
        cats.find({}, (err, data) => {
            res.json(data)
        })
    })

}

