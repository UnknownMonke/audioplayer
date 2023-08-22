# Music Backend Server

Node.js server to provide persistence to the Music Application.

## Description

This project uses [Express](https://expressjs.com/) to build the node server, 
[body-parser](https://www.npmjs.com/package/body-parser) to parse data from incoming requests and 
[cors](https://www.npmjs.com/package/cors).

The server directly reads the file from the filesystem.
A python script is used to generate static JSON files for the playlists and titles.
Songs are hosted within the server, inside the /data directory.

## Startup

Simply run `npm start` to launch the server. Default port is 4000.
[nodemon](https://nodemon.io/) allows for fast restart.
