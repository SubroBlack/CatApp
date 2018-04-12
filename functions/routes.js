//'use strict';

const express = require('express');
const app = express();
const path = require('path'); 

module.exports = (app) =>{
        
    // Serve static files from the public folder
    app.use(express.static('public'));

    // Rendering Cats form to the /new path
    app.get('/new', (req, res) => {
        res.sendFile(path.join(__dirname,'../public/form.html'));
    })

}
