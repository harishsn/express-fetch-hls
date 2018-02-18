var express = require('express');
var router = express.Router();
var hlsfetcher = require('../vendor/hls-fetcher/src');
var validator = require('../utils/validator');
var filesystem = require('../utils/filesystem');

/* GET stream. */
router.get('/', function(req, res, next) {

  if(!validator.validateRemoteURL(req.query.hlsurl)){
        res.send({
            success : false,
            message : 'Enter valid remote url with extension .m3u8 or .m3u'
        });
    }

  var path = filesystem.getStorableLocationDetails(req.query.hlsurl);

  var options = {
    input: req.query.hlsurl,
    output: path.rel_dir,
    concurrency: 5,
    decrypt: false
  };

  hlsfetcher(options).then(function() {
    res.send({
          success : true,
          message : `${req.protocol}://${req.hostname}:3000/storage/${path.rel_file}`
        });
  }).catch(function(error) {
    res.send(error);
  });
});

module.exports = router;
