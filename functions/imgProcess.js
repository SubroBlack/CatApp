'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');
const sharp = require('sharp');

module.exports = (app) => {
        
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

}
