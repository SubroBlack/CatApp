'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');
const sharp = require('sharp');

// dotenv for the MongoDB user access
require('dotenv').config();
const path = require('path'); 


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

//Connecting to the Database 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/test`).then(() => {
  console.log('Connected successfully!!!!.');
  app.listen(3000);
}, err => {
  console.log('Connection to db failed: ' + err);
});

// Serve static files from the public folder
app.use(express.static('public'));

// Rendering Cats form to the /new path
app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/form.html'));
})

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
                if(exifData.gps.GPSLatitude){
                    resolve({
                        lat: gpsToDecimal(exifData.gps.GPSLatitude,
                            exifData.gps.GPSLatitudeRef),
                        lng: gpsToDecimal(exifData.gps.GPSLongitude,
                            exifData.gps.GPSLongitudeRef),
                    });
                } else {
                    resolve({
                        lat: 60.20803888888889,
                        lng: 24.662988888888886,
                    })  
                }
            }
        });
    });
}

//Using Multer to get the image file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/media/original');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

// Reading the Form to create a new Cat 
app.post('/add', upload.single('original'), (req, res) => {
    const originalPath = path.join('public/media/original', req.file.filename);
    //const thumbPath = path.join('media/thumbnails/', req.file.filename);
    
    req.body.original = originalPath;
    req.body.image = originalPath;
    req.body.thumbnail = originalPath;
    req.body.time = Date.now();
    
    if(req.file.mimetype == 'png'){
        resize(originalPath, thumbPath, 512, 512);
        req.body.thumbnail = thumbPath;
    }
    
    getSpot(originalPath)
    .then((coords) =>{
        req.body.coordinates = coords;

        Cats.create(req.body, (err, obj) => {
            if (err){
                console.log(err)
                res.redirect('/new');
            } else {
                console.log('successfully added an entry to the database')
                console.log(obj)
                //res.redirect('/new');
            }
        });

    }).catch(err => console.log(err));
    res.redirect('/');
})
app.get('/api', (req, res) => {
    Cats.find({}, (err, data) => {
        res.json(data)
    })
})
// Retrieving the data from the Database
