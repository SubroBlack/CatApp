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

