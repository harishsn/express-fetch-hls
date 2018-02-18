var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'September',
    content: 'App that downloads a playable HLS playlist and associated video segments so that they can be hosted on this server statically for playback.' });
});

module.exports = router;
