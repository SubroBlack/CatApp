'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ExifImage = require('exif').ExifImage;

// dotenv for the MongoDB user access
require('dotenv').config();
const path = require('path');


// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/JSON
app.use(bodyParser.json());

//Connecting to the Database 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/test`).then(() => {
  console.log('Connected successfully!!!!.');
  console.log(process.env.NAME); 
  app.listen(3000);
}, err => {
  console.log('Connection to db failed: ' + err);
});

// Serve static files from the public folder
app.use(express.static('public'));

// Rendering Cats form to the /new path
app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/form.html'));
})

// Creating a Schema for the cat
const Schema = mongoose.Schema;

const catSchema = new Schema({
    category: String,
    title: String,
    description: String,
    
});

// Using the created Cat Schema to create a cat instance
const Cat = mongoose.model('Cat', catSchema);


// Reading the Form to create a new Cat 
app.post('/add', (req, res) => {
    console.log(JSON.stringify(req.body));
    Cat.create(req.body).then(post => {
        console.log(process.env.Name + ' created a new cat: ');
        console.log(post.id);
        console.log(post.title);
        console.log(post.category);
    });
    res.redirect('/');
})

/*// Using Exif to abstract the data from an image
const myTable =  new ExifImage({ image : './media/taable.jpg' }, function (error, exifData) {
 if (error) {console.log('Error: '+error.message);} 
 else{
  console.log(exifData); // Do something with your data!
}
});*/

// Retrieving the data from the Database
