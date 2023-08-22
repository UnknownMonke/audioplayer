const express = require('express');
const fs = require('fs');

const titles = './data/titles.json';

const root = './data/songs/';

const titleRoutes = express.Router();
const reader = new FileReader();


titleRoutes.route('/get')
  .get( (req, res) => {

    fs.readFile(titles, (err, data) => {
        if(err) {
            console.log(err);
            res.status(400).send("Error reading file");
        }
        console.log(JSON.parse(data));
        res.status(200).json(JSON.parse(data));
    });
  }); 


titleRoutes.route('/stream')
  .get( (req, res) => {

    fs.opendir(root + req.params.playlist, (err, files) => {
        if(err) {
            console.log(err);
            res.status(400).send("Unknown Playlist");
        }
        files.foreach( (file, index) => {
            if(file === req.params.title) {
                reader.readAsDataURL(file, (err, data) => {
                    if(err) {
                        console.log(err);
                        res.status(400).send("Error reading file");
                    }
                    res.status(200).json(data);
                });
            }
        })
    });
  })

module.exports = titleRoutes;