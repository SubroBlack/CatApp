const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

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

// Using the created Cat Schema to create a cat instance
const Cats = mongoose.model( 'kittykitties', catSchema);
module.exports.Cats = Cats;

// Creating Entries in the database

const createEntry = (body) => {
    Cats.create(body, (err, obj) => {
        if (err){
            console.log('Error in creating the Cat in cats.create: ' + err)
        } else {
            console.log('successfully added an entry to the database')
            console.log(obj);
        }
    })
}
module.exports.createEntry = createEntry;

const editEntry = (body, res) => {
    Cats.findOneAndUpdate({_id: body.id}, 
        { $set: { details: body.details, 
            title: body.title, 
            category: body.category, 
            time: body.time,
            image: body.image,
            thumbnail: body.thumbnail,
            original: body.original}}, 
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
const findAll = (res) => {
    Cats.find({}, (err, data) => {
        res.json(data)
    })
}
module.exports.findAll = findAll;

// Find filtered entries
const filterEntry = (filter, res) => {
    Cats.find({title : filter}, (err, data) => {
        res.json(data)
    })
}
module.exports.filterEntry = filterEntry;

// Delete an entry 
const delEntry = (filter) => {
    Cats.remove({ _id: filter }, function (err) {
        if(err) return handleError(err);
    });
}
module.exports.delEntry = delEntry;