var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/player', function(req, res, next){
  var options = {
    host: 'localhost',
    port: 23232,
    path: '/player'
  };
  
  http.request(options, function(response){
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      res.render('player', { player : JSON.parse(str) });
    });
  }).end();
  
});

module.exports = router;
