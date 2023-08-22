/**
 * Server main configuration file.
 */
const express = require('express');
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const playlistRoutes = require('./routes/playlist.route');
const titleRoutes = require('./routes/title.route');

app.use('/playlists', playlistRoutes);
app.use('/titles', titleRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
