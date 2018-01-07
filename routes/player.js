var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');

router.get('/:id?', function(req, res, next){
  var path = "/player";
  var showForm = true;

  // Route parameter (id) means the user is looking
  // for a specific player.
  if (req.params.id) {
    path = "/player/" + req.params.id;
    showForm = false;
  }

  // Path parameters means the user's doing a search.
  else if (Object.keys(req.query).length) {
    path = "/player" +  req.url.slice(1);
    showForm = true;
  }

  var options = {
    host: 'localhost',
    port: 23232,
    path: path
  };

  http.request(options, function(response){
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
        });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        res.render('player', { player : JSON.parse(str), showForm : showForm });
        });
  }).end();

});

router.post('/', function(req, res, next) {
  var playerJson = {};

  const name = req.body.name;
  playerJson.name = name.length > 0 ? name : null;
  const telegramId = parseInt(req.body.telegramId);
  playerJson.telegramId = telegramId >= 0 ? telegramId : null;
  const telegramUsername = req.body.telegramUsername;
  playerJson.telegramUsername = telegramUsername.length > 0 ? telegramUsername : null;

  console.dir(playerJson);

  request.post(
    // TODO(gus): replace with constant
    'http://localhost:23232/player',
    {json: playerJson,
      qs: {
        // TODO(gus): this is ok, but could be better.
        key : process.env.CAPSTATS_API_KEY
      }},
    function (error, response, body) {
      // TODO(gus): what to do here?
      if (error) {
        console.log(error);
        return;
      }
      console.log("Response status code: %d", response.statusCode);
      if (response.statusCode != 200) return;
      console.log(body);
    });

  res.redirect('/player');

});

module.exports = router;
