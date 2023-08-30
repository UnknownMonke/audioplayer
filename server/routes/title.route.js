const express = require('express');
const fs = require('fs');
const { join } = require('path');

const titles = './data/titles.json';
const root = './data/songs/';

const titleRoutes = express.Router();


titleRoutes.route('/get')
  .get( (req, res) => {

    fs.readFile(titles, (err, data) => {
      if(err) {
        console.log(err);
        res.status(400).send("Error reading file");
      }
      res.status(200).json(JSON.parse(data));
    });
  }); 


titleRoutes.route('/stream')
  .post( (req, res) => {

    fs.readdir(root + req.body.playlist, (err, files) => {
      if(err) {
        console.log(err);
        res.status(400).send("Unknown Playlist");
      }
      files.forEach( (file) => {
        
        if(file === req.body.title) {

          fs.readFile(join(root, req.body.playlist, file), (err, data) => {
            if(err) {
              console.log(err);
              res.status(400).send("Error reading file");
            }
            res.status(200).send('data:audio/mp3;base64,' + data.toString('base64'));
          });
        }
      })
    });
  })

module.exports = titleRoutes;