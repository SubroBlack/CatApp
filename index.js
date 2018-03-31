'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');

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
    details: String,
    original: String,
});

// Using the created Cat Schema to create a cat instance
const Cat = mongoose.model('Cat', catSchema);

// Convert the retrieved GPS data into GMaps format
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
  };

// Using Exif to make function to abstract the co-ordinates from an image
const getSpot = (image_path) => {
    return new Promise((resolve, reject) => {
        new ExifImage({image: image_path}, (error, exifData) => {
            if (error) {
            reject('Error: ' + error.message);
            } else {
                resolve({
                    lat: gpsToDecimal(exifData.gps.GPSLatitude,
                        exifData.gps.GPSLatitudeRef),
                    lng: gpsToDecimal(exifData.gps.GPSLongitude,
                        exifData.gps.GPSLongitudeRef),
                });
            }
        });
    });
}

//Using Multer to get the image file
const upload = multer({dest: 'public/media'});

// Reading the Form to create a new Cat 
app.post('/add', upload.single('original'), (req, res) => {
    req.body.original = 'public/media/' + req.file.filename;
    console.log(req.body)
    Cat.create(req.body).then(post => {
        console.log(process.env.Name + ' created a new cat: ');
        console.log(post.id);
        console.log(post.title);
        console.log(post.category);
        console.log(post.original);
        getSpot(post.original).then(resp => {
            console.log(resp);/*
            gpsToDecimal(resp,hem).then(resp => {
                console.log(resp);
            })*/
        })
    });
    res.redirect('/');
})

// Retrieving the data from the Database
