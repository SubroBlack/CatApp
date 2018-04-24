'use strict';

// Import other js files
const users = require('./users.js');
const entry = require('./entry.js');

module.exports = (app) =>{

    // Serve the home page from pug template
    app.get('/', (req, res) => {
        res.render('index', { pageTitle: 'CatApp' });
    });

    // Rendering Cats add form to the /new path
    app.get('/new', (req, res) => {
        res.render('form');
    })

    // Edit Route to send form
    app.get('/edit/:id', function (req, res) {
        console.log('The object is asking for edit form: ' + req.params.id + ' User ' + req.user);
        entry.findEntry(req, res);
    }) 

    // Sending file to ./api URL to monitor the jSON arrays
    app.get('/api/:owner', (req, res) => {
        req.userId = app.loggedUser;
        entry.findAll(req, res);
    })

    // Sending file to ./api URL after the search results
    app.get('/api/:owner/:title', (req, res) => {
        console.log('The owner of the data' + req.params.owner);
        console.log('The title of the data' + req.params.title);
        entry.filterEntry( req, res);
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
