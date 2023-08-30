const express = require('express');
const fs = require('fs');

const playlists = './data/playlists.json';

const playlistRoutes = express.Router();

playlistRoutes.route('/get')
  .get( (req, res) => {

    fs.readFile(playlists, (err, data) => {
      if(err) {
        console.log(err);
        res.status(400).send("Error reading file");
      }
      res.status(200).json(JSON.parse(data));
    });
  });

module.exports = playlistRoutes;
