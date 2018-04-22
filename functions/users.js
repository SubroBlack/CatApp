'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');


// Importing Models file
const User = require('./models.js'); 

module.exports = (app) => {
    //SignUp form POST
    app.post('/signUp', (req, res) => {
     const name = req.body.name;
     const email = req.body.email;
     const password = req.body.password;
     const password2 = req.body.password2;

     console.log(name);
    
     const newUser = new User.User({
        username: email,
        name: name,
        email: email,
        password: password
     });

     User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
     })

     res.redirect('/login');
    })

    // Authenicating the user input 
    passport.use(new LocalStrategy(
        function(username, password, done){
            User.getUserByUsername(username, function(err, user){
                if (err) throw err;
                if(!user){
                    return done(null, false, {message: 'Invalid User'});
                }
                console.log('Username is matched');
                User.comparePassword(password, user.password, function(err, isMatch){
                    if(err) throw err;
                    if(isMatch){
                        console.log('password is matched');
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Invalid Password'});
                    }
                });

            });
        }
    ));

    // Serialize the User data
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // Deserialize User Data
    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
          done(err, user);
        });
    });
      

    // SignIN
    app.post('/login',
        passport.authenticate('local', {successRedirect: '/', failureRedirect:'/login' }),
        (req,res) => {
            res.redirect('/');
    })

    app.get('/logout', (req,res) => {
        req.logout();
        console.log('User is logged out');
        res.redirect('/login');
    })
 
}

