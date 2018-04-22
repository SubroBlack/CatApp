'use strict';

const express = require('express');
const app = express();
const path = require('path'); 

// Import other js files
const users = require('./users.js');
const entry = require('./entry.js');

module.exports = (app) =>{
        
    // Serve static files from the public folder
    app.use(express.static('public'));

    // Serve the home page from pug template
    app.get('/', (req, res) => {
        console.log(app.loggedUser);
        res.render('index', { pageTitle: 'CatApp' });
    });

    // Rendering Cats form to the /new path
    app.get('/new', (req, res) => {
        res.render('form');
    })

    // Edit Route to send form
    app.get('/edit/:id', function (req, res) {
        console.log('The object is asking for edit form: ' + req.params.id);
        entry.Cats.findOne({ _id: req.params.id }, (err, data) => {
            res.render('formEdit', { ID: data._id, category: data.category, title: data.title, details: data.details, original: data.original });
        })
    }) 

    // Sending file to ./api URL to monitor the jSON arrays
    app.get('/api', (req, res) => {
        entry.Cats.find({}, (err, data) => {
            res.json(data)
        })
    })

    // Sending file to ./api URL after the search results
    app.get('/api/:filter', (req, res) => {
        console.log(req.params.filter);
        entry.Cats.find({title: req.params.filter}, (err, data) => {
            res.json(data)
        })
    })

    //SignUp form 
    app.get('/signUp', (req, res) => {
        res.render('signUpForm' , { pageTitle: 'Register' });
    })

    //Login form 
    app.get('/login', (req, res) => {
        res.render('login' , { pageTitle: 'Login' });
    })

    // Handling Users
    users(app);

}
