var express = require('express');
var router = express.Router();
var db_manager = require('../service/dbService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express fetch hls',
    content: 'App that downloads a playable HLS playlist and associated video segments so that they can be hosted on this server statically for playback.'
  });
});

module.exports = router;
