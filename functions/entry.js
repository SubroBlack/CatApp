const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Using index file to get the logged user id;
const index = require('../index.js');

// Creating a Schema for the cat
const catSchema = new Schema({
category: String,
title: String,
details: String,
coordinates : {
    lat: Number,
    lng: Number
},
original: String,
image : String,
thumbnail : String,
time: Date
});

// Checking if the user is logged in 
const checkLog = (req) => {
    let userId;
    if(req.user){
        userId = req.user._id;
    } else {
        userId = null;
    }
    console.log('The user is ' + req.user);
    console.log('The index loggedUser is ' + index.loggedUser);
    console.log(userId);
    console.log('id' + userId + 'OfUser');
}

// Using the created Cat Schema to create a cat instance
const Cats = mongoose.model( 'kittykitties', catSchema);

// Creating Entries in the database

const createEntry = (req) => {
    Cats.create(req.body, (err, obj) => {
        if (err){
            console.log('Error in creating the Cat in cats.create: ' + err)
        } else {
            console.log('successfully added an entry to the database')
            console.log(obj);
        }
    })
}
module.exports.createEntry = createEntry;

const editEntry = (req, res) => {
    Cats.findOneAndUpdate({_id: req.body.id}, 
        { $set: { details: req.body.details, 
            title: req.body.title, 
            category: req.body.category, 
            time: req.body.time,
            image: req.body.image,
            thumbnail: req.body.thumbnail,
            original: req.body.original}}, 
            function (err, cat) {
        if(err) return handleError(err);
        cat.save();
        res.redirect('/');
    })
}
module.exports.editEntry = editEntry;

// Function to find an entry 
const findEntry = (req, res) => {
    Cats.findOne({ _id: req.params.id }, (err, data) => {
        res.render('formEdit', { ID: data._id, category: data.category, title: data.title, details: data.details, original: data.original });
    })
}
module.exports.findEntry = findEntry;

// Function to find all Entries 
const findAll = (req, res) => {
    //checkLog(req);
    console.log('From inside the model '+ req.user);
    Cats.find({}, (err, data) => {
        res.json(data)
    })
}
module.exports.findAll = findAll;

// Find filtered entries
const filterEntry = (req, res) => {
    Cats.find({title : req.params.filter}, (err, data) => {
        res.json(data)
    })
}
module.exports.filterEntry = filterEntry;

// Delete an entry 
const delEntry = (req) => {
    Cats.remove({ _id: req.params.id }, function (err) {
        if(err) return handleError(err);
    });
}
module.exports.delEntry = delEntry;