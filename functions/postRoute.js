'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');
const sharp = require('sharp');
const path = require('path'); 

// Import other js files
const crud = require('./crud.js');

// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/JSON
app.use(bodyParser.json());

// Using Sharp to resize the image
const resize = (input, output, w, h) => {
    return new Promise((resolve, reject) => {
        sharp({url:input, encoding:null}).resize(w, h).toFile(output, (err, info) => {
            if(err)
            reject(err);
            if(info)
            resolve(info);
        });
    })
}

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
            reject('Error in getSpot function: ' + error.message);
            } else {
                if(exifData.gps.GPSLatitude){
                    resolve({
                        lat: gpsToDecimal(exifData.gps.GPSLatitude,
                            exifData.gps.GPSLatitudeRef),
                        lng: gpsToDecimal(exifData.gps.GPSLongitude,
                            exifData.gps.GPSLongitudeRef),
                    });
                } else {
                    resolve({
                        lat: 40.748817,
                        lng: -73.985428,
                    })  
                }
            }
        });
    });
}

//Using Multer to get the image file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join('public', 'media','original' ));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

module.exports = (app) => {

// Creating a Schema for the cat
const Schema = mongoose.Schema;

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
const Cats = mongoose.model('Cats', catSchema);
        
    /////////////POST/////////////

    // Reading the Form to create a new Cat 
    app.post('/add', upload.single('original'), (req, res, next) => {
        const originalPath = path.join('media', 'original', req.file.filename);
        //const thumbPath = path.join('media/thumbnails/', req.file.filename);

        req.body.original = originalPath;
        req.body.image = originalPath;
        req.body.thumbnail = originalPath;
        req.body.time = Date.now();
        
        /*if(req.file.mimetype == 'png'){
            resize(originalPath, thumbPath, 512, 512);
            req.body.thumbnail = thumbPath;
        }*/
        
        getSpot(path.join('public', originalPath))
        .then((coords) =>{
            req.body.coordinates = coords;

            Cats.create(req.body, (err, obj) => {
                if (err){
                    console.log('Error in creating the Cat in cats.create: ' + err)
                } else {
                    console.log('successfully added an entry to the database')
                    console.log(obj);
                }
            })

        }).catch(err => console.log('Error while calling the getSpot inside app.post: ' + err));
        res.redirect('/');
    })
    
    // Handling the CRUD requests in crud.js
    crud(app, Cats);
}