var express = require('express');
var router = express.Router();
var hlsfetcher = require('../vendor/hls-fetcher/src');
var validator = require('../service/validatorService');
var filesystem = require('../service/fileService');
var db_manager = require('../service/dbService');
var path = require('path');

/* GET stream. */
router.get('/', function(req, res, next) {

  // Validate for valid input url
  if(!validator.validateRemoteURL(req.query.hlsurl)){
        res.send({
            success : false,
            message : 'Enter valid remote url with extension .m3u8 or .m3u'
        });
    }

    //Get downloadable path
    var path = filesystem.getStorableLocationDetails(req.query.hlsurl);

    // Fetch video components from url
    var options = {
      input: req.query.hlsurl,
      output: path.rel_dir,
      concurrency: 5,
      decrypt: false
    };

    hlsfetcher(options).then(function() {
      var local_url = `${req.protocol}://${req.hostname}/storage/${path.rel_file}`;
      addEntryToDatabase(req.query.hlsurl, local_url);
      res.send({
            success : true,
            message : local_url
          });
    }).catch(function(error) {
      res.status(500).send({
            success : false,
            message : `Something went wrong`
          });
    });
});

// Add to database if not exists
function addEntryToDatabase(hlsurl, local_url){
  db_manager.getEntry(hlsurl)
  .then(response => {
    if(response.length == 0) {
      db_manager.insertEntry(local_url, hlsurl);
    }
  });
}


/* GET recent fetches. */
router.get('/recent', function(req, res, next) {
  db_manager.getAllEntries()
  .then(response => {
    res.send({
          success : true,
          message : response
        });
  }).catch(error => {
    console.log(error);
    res.status(500).send({
          success : false,
          message : error
        });
  });
});

module.exports = router;
